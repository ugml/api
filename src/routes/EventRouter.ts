import { IRouter, NextFunction, Response, Router as newRouter, Router } from "express";
import Calculations from "../common/Calculations";
import Config from "../common/Config";
import Database from "../common/Database";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import Redis from "../common/Redis";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import ICoordinates from "../interfaces/ICoordinates";
import IEventService from "../interfaces/IEventService";
import IPlanetService from "../interfaces/IPlanetService";
import IShipUnits from "../interfaces/IShipUnits";
import squel = require("safe-squel");
import Logger from "../common/Logger";
import Event from "../units/Event";

const validator = require("jsonschema").Validator;
const jsonValidator = new validator();
const eventSchema = require("../schemas/fleetevent.schema.json");

// TODO: validate input data:
//  is start != end?
//  is missionSpeed % 10 = 0 and 0 <= missionSpeed <= 100 (should already be handled by schema)
//  units.json => check all values (capacity, etc).
//  loaded resources > storage?

/**
 * Defines routes for event-creation and cancellation
 */
export default class EventRouter {
  public router: IRouter<{}> = newRouter();

  private planetService: IPlanetService;
  private eventService: IEventService;

  /**
   * Registers the routes and needed services
   * @param container the IoC-container with registered services
   */
  public constructor(container) {
    this.planetService = container.planetService;
    this.eventService = container.eventService;

    this.router.post("/create/", this.createEvent);
    this.router.post("/cancel/", this.cancelEvent);
  }

  /**
   * Returns the speed of the slowest ship in the fleet
   * @param units The sent ship in this event
   */
  private getSlowestShipSpeed(units: IShipUnits): number {
    const unitData = require("../config/units.json");

    let minimum: number = Number.MAX_VALUE;

    for (const ship in units) {
      if (units[ship] > 0 && unitData.units.ships[ship].speed < minimum) {
        minimum = unitData.units.ships[ship].speed;
      }
    }

    return minimum;
  }

  /**
   * Returns the ID of the destination-type
   * @param type The type as a string (planet, moon or debris)
   */
  private static getDestinationTypeByName(type: string): number {
    let typeID: number;
    switch (type) {
      case "planet":
        typeID = 1;
        break;
      case "moon":
        typeID = 2;
        break;
      case "debris":
        typeID = 3;
    }

    return typeID;
  }

  /**
   * Returns the ID of the mission-type
   * @param mission The type as a string (transport, attack, ...)
   */
  private static getMissionTypeID(mission: string): number {
    let missionTypeID: number;
    switch (mission) {
      case "transport":
        missionTypeID = 0;
        break;
      case "deploy":
        missionTypeID = 1;
        break;
      case "attack":
        missionTypeID = 2;
        break;
      case "acs":
        missionTypeID = 3;
        break;
      case "hold":
        missionTypeID = 4;
        break;
      case "colonize":
        missionTypeID = 5;
        break;
      case "harvest":
        missionTypeID = 6;
        break;
      case "espionage":
        missionTypeID = 7;
        break;
      case "destroy":
        missionTypeID = 8;
    }

    return missionTypeID;
  }

  /**
   * Creates a new event
   * @param request
   * @param response
   * @param next
   */
  public createEvent = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    // TODO: check if enough ships on planet
    // TODO: check if planet has enough deuterium

    if (!InputValidator.isSet(request.body.event)) {
      return response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid parameter",
        data: {},
      });
    }

    const eventData = JSON.parse(request.body.event);

    const userID = parseInt(request.userID, 10);
    const ownerID = parseInt(eventData.ownerID, 10);

    // validate JSON against schema
    if (!jsonValidator.validate(eventData, eventSchema).valid) {
      return response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid json",
        data: {},
      });
    }

    // check if sender of event == currently authenticated user
    if (userID !== ownerID) {
      return response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Event-creator is not currently authenticated user",
        data: {},
      });
    }

    // TODO: temporary
    if (["deploy", "acs", "hold", "harvest", "espionage", "destroy"].indexOf(eventData.mission) >= 0) {
      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "Missiontype not yet supported",
        data: {},
      });
    }

    const positionOrigin: ICoordinates = {
      galaxy: eventData.data.origin.galaxy,
      system: eventData.data.origin.system,
      planet: eventData.data.origin.planet,
      type: EventRouter.getDestinationTypeByName(eventData.data.origin.type),
    };

    const positionDestination: ICoordinates = {
      galaxy: eventData.data.destination.galaxy,
      system: eventData.data.destination.system,
      planet: eventData.data.destination.planet,
      type: EventRouter.getDestinationTypeByName(eventData.data.destination.type),
    };

    const startPlanet = await this.planetService.getPlanetOrMoonAtPosition(positionOrigin);
    const destinationPlanet = await this.planetService.getPlanetOrMoonAtPosition(positionDestination);

    if (startPlanet.ownerID !== userID) {
      return response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "The player does not own the start-planet",
        data: {},
      });
    }

    // planet does not exist or player does not own it
    if (!InputValidator.isSet(startPlanet)) {
      return response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid parameter",
        data: {},
      });
    }

    // destination does not exist
    if (!InputValidator.isSet(destinationPlanet) && eventData.mission !== "colonize") {
      return response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Destination does not exist",
        data: {},
      });
    }

    const distance = Calculations.calculateDistance(eventData.data.origin, eventData.data.destination);

    const gameConfig = Config.getGameConfig();

    const slowestShipSpeed = this.getSlowestShipSpeed(eventData.data.ships);

    // calculate duration of flight
    const timeOfFlight = Calculations.calculateTimeOfFlight(
      gameConfig.speed,
      eventData.speed,
      distance,
      slowestShipSpeed,
    );

    let event: Event = new Event();

    event.eventID = 0;
    event.ownerID = eventData.ownerID;
    event.mission = EventRouter.getMissionTypeID(eventData.mission);
    event.fleetlist = JSON.stringify(eventData.data.ships);
    event.start_id = startPlanet.planetID;
    event.start_type = EventRouter.getDestinationTypeByName(eventData.data.origin.type);
    event.start_time = Math.round(+new Date() / 1000);
    event.end_id = destinationPlanet.planetID;
    event.end_type = EventRouter.getDestinationTypeByName(eventData.data.destination.type);
    event.end_time = Math.round(event.start_time + timeOfFlight);
    event.loaded_metal = eventData.data.loadedRessources.metal;
    event.loaded_crystal = eventData.data.loadedRessources.crystal;
    event.loaded_deuterium = eventData.data.loadedRessources.deuterium;
    event.returning = false;
    event.deleted = false;

    const [result] = await this.eventService.createNewEvent(event);

    event.eventID = parseInt(result.insertId, 10);

    // all done
    return response.status(Globals.Statuscode.SUCCESS).json({
      status: Globals.Statuscode.SUCCESS,
      message: "Event successfully created.",
      data: event,
    });
  };

  /**
   * Cancels an event
   * @param request
   * @param response
   * @param next
   */
  public cancelEvent = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    if (!InputValidator.isSet(request.body.eventID) || !InputValidator.isValidInt(request.body.eventID)) {
      return response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid parameter",
        data: {},
      });
    }

    const planetQuery: string = squel
      .select()
      .from("events")
      .where("eventID = ?", request.body.eventID)
      .where("`returning` = ?", 0)
      .where("ownerID = ?", request.userID)
      .toString();

    // check if origin-planet exists and the user owns it
    Database.query(planetQuery)
      .then(results => {
        const event = results[0];

        // destination does not exist
        if (!InputValidator.isSet(event)) {
          return response.status(Globals.Statuscode.BAD_REQUEST).json({
            status: Globals.Statuscode.BAD_REQUEST,
            message: "The event does not exist or can't be canceled",
            data: {},
          });
        }

        // (time passed from start until cancel) + (time now)
        const newEndTime: number = Math.round(+new Date() / 1000) - event.start_time + Math.round(+new Date() / 1000);

        const updateQuery: string = squel
          .update()
          .table("events")
          .set("start_id", event.end_id)
          .set("start_type", event.end_type)
          .set("start_time", Math.round(+new Date() / 1000))
          .set("end_id", event.start_id)
          .set("end_type", event.start_type)
          .set("end_time", newEndTime)
          .set("`returning`", 1)
          .where("eventID = ?", request.body.eventID)
          .where("`returning` = ?", 0)
          .where("ownerID = ?", request.userID)
          .toString();

        Database.query(updateQuery).then(() => {
          // remove the event from the redis-queue
          Redis.getConnection().zremrangebyscore("eventQueue", request.body.eventID, request.body.eventID);

          // add the event with the new endtime
          Redis.getConnection().zadd("eventQueue", request.body.eventID, newEndTime);

          // all done
          return response.status(Globals.Statuscode.SUCCESS).json({
            status: Globals.Statuscode.SUCCESS,
            message: "Event successfully canceled.",
            data: {},
          });
        });
      })
      .catch(error => {
        Logger.error(error);

        return response.status(Globals.Statuscode.SERVER_ERROR).json({
          status: Globals.Statuscode.SERVER_ERROR,
          message: `An error occured: ${error.message}`,
          data: {},
        });
      });
  };
}
