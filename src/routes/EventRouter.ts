import { NextFunction, Response, Router as newRouter } from "express";
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
import squel = require("safe-squel");
import Logger from "../common/Logger";
import EventService from "../services/EventService";
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
  public router = newRouter();

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
   * Creates a new event
   * @param request
   * @param response
   * @param next
   */
  public createEvent = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      // TODO: check if enough ships on planet
      // TODO: check if planet has enough deuterium

      if (!InputValidator.isSet(request.body.event)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const eventData = JSON.parse(request.body.event);

      // validate JSON against schema
      if (!jsonValidator.validate(eventData, eventSchema).valid) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid json",
        });
      }

      const userID = parseInt(request.userID, 10);
      const ownerID = parseInt(eventData.ownerID, 10);

      // check if sender of event == currently authenticated user
      if (userID !== ownerID) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Event-creator is not currently authenticated user",
        });
      }

      // TODO: temporary
      if (["deploy", "acs", "hold", "harvest", "espionage", "destroy"].indexOf(eventData.mission) >= 0) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Missiontype not yet supported",
        });
      }

      const positionOrigin: ICoordinates = {
        posGalaxy: eventData.data.origin.posGalaxy,
        posSystem: eventData.data.origin.posSystem,
        posPlanet: eventData.data.origin.posPlanet,
        type: this.getDestinationTypeByName(eventData.data.origin.type),
      };

      const positionDestination: ICoordinates = {
        posGalaxy: eventData.data.destination.posGalaxy,
        posSystem: eventData.data.destination.posSystem,
        posPlanet: eventData.data.destination.posPlanet,
        type: this.getDestinationTypeByName(eventData.data.destination.type),
      };

      const startPlanet = await this.planetService.getPlanetOrMoonAtPosition(positionOrigin);
      const destinationPlanet = await this.planetService.getPlanetOrMoonAtPosition(positionDestination);

      if (!InputValidator.isSet(startPlanet) || startPlanet.ownerID !== userID) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Origin does not exist or user is not the owner",
        });
      }

      // destination does not exist
      if (!InputValidator.isSet(destinationPlanet) && eventData.mission !== "colonize") {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Destination does not exist",
        });
      }

      const distance = Calculations.calculateDistance(eventData.data.origin, eventData.data.destination);

      const gameConfig = Config.getGameConfig();

      const slowestShipSpeed = Calculations.getSlowestShipSpeed(eventData.data.ships);

      // calculate duration of flight
      const timeOfFlight = Calculations.calculateTimeOfFlight(
        gameConfig.speed,
        eventData.speed,
        distance,
        slowestShipSpeed,
      );

      const event: Event = new Event();

      event.eventID = 0;
      event.ownerID = eventData.ownerID;
      event.mission = this.getMissionTypeID(eventData.mission);
      event.fleetlist = JSON.stringify(eventData.data.ships);
      event.startID = startPlanet.planetID;
      event.startType = this.getDestinationTypeByName(eventData.data.origin.type);
      event.startTime = Math.round(+new Date() / 1000);
      event.endID = destinationPlanet.planetID;
      event.endType = this.getDestinationTypeByName(eventData.data.destination.type);
      event.endTime = Math.round(event.startTime + timeOfFlight);
      event.loadedMetal = eventData.data.loadedRessources.metal;
      event.loadedCrystal = eventData.data.loadedRessources.crystal;
      event.loadedDeuterium = eventData.data.loadedRessources.deuterium;
      event.returning = false;
      event.processed = false;

      const [result] = await this.eventService.createNewEvent(event);

      event.eventID = parseInt(result.insertId, 10);

      // insert into redis
      Redis.getConnection().zadd("eventQueue", event.endTime, event.eventID);

      // all done
      return response.status(Globals.Statuscode.SUCCESS).json(event);
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        error: "There was an error while handling the request.",
      });
    }
  };

  /**
   * Cancels an event
   * @param request
   * @param response
   * @param next
   */
  public cancelEvent = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (!InputValidator.isSet(request.body.eventID) || !InputValidator.isValidInt(request.body.eventID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const eventID = parseInt(request.body.eventID, 10);

      const event: Event = await this.eventService.getEventOfPlayer(userID, eventID);

      if (!InputValidator.isSet(event) || event.returning === true) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "The event does not exist or can't be canceled",
        });
      }

      // (time passed from start until cancel) + (time now)
      event.endTime = Math.round(+new Date() / 1000) - event.startTime + Math.round(+new Date() / 1000);
      event.startTime = Math.round(+new Date() / 1000);

      await this.eventService.cancelEvent(event);

      // remove the event from the redis-queue
      Redis.getConnection().zremrangebyscore("eventQueue", event.endTime, event.eventID);

      // add the event with the new endtime
      Redis.getConnection().zadd("eventQueue", event.endTime, request.body.eventID);

      // all done
      return response.status(Globals.Statuscode.SUCCESS).json();
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        error: "There was an error while handling the request.",
      });
    }
  };

  /**
   * Returns the ID of the destination-type
   * @param type The type as a string (planet, moon or debris)
   */
  private getDestinationTypeByName(type: string): number {
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
  private getMissionTypeID(mission: string): number {
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
}
