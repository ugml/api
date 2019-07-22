import { NextFunction, Response, Router } from "express";
import { Database } from "../common/Database";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import { Redis } from "../common/Redis";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { ICoordinates } from "../interfaces/ICoordinates";
import { IShipUnits } from "../interfaces/IShipUnits";

const validator = require("jsonschema").Validator;
const jsonValidator = new validator();
import squel = require("safe-squel");

import { Logger } from "../common/Logger";

const eventSchema = require("../schemas/fleetevent.schema.json");

// TODO: validate input data:
//  is start != end?
//  is missionSpeed % 10 = 0 and 0 <= missionSpeed <= 100 (should already be handled by schema)
//  units.json => check all values (capacity, etc).
//  loaded resources > storage?

export class EventRouter {
  // TODO: relocate to own file with other game-related calculations
  /**
   * Calculates the distances between two planets
   * Source: http://www.owiki.de/index.php?title=Entfernung
   * @param origin The first planet
   * @param destination The second planet
   */
  private static calculateDistance(origin: ICoordinates, destination: ICoordinates): number {
    const distances = [
      Math.abs(origin.galaxy - destination.galaxy),
      Math.abs(origin.system - destination.system),
      Math.abs(origin.planet - destination.planet),
    ];

    const distance = 0;

    if (distances[0] !== 0) {
      return distances[0] * 20000;
    }
    if (distances[1] !== 0) {
      return distances[1] * 95 + 2700;
    }
    if (distances[2] !== 0) {
      return distances[2] * 5 + 1000;
    }

    return distance;
  }

  /**
   * Calculates the time of flight in seconds
   * @param gameSpeed The speed of the game (default: 3500)
   * @param missionSpeed The speed of the whole mission (possible values: 0, 10, 20, ..., 100)
   * @param distance The distance between the start and the end
   * @param slowestShipSpeed The speed of the slowest ship in the fleet
   */
  private static calculateTimeOfFlight(
    gameSpeed: number,
    missionSpeed: number,
    distance: number,
    slowestShipSpeed: number,
  ): number {
    // source: http://owiki.de/index.php?title=Flugzeit
    return Math.round(
      Math.pow((3500 / (missionSpeed / 100)) * ((distance * 10) / slowestShipSpeed), 0.5) + 10 / gameSpeed,
    );
  }

  /**
   * Returns the speed of the slowest ship in the fleet
   * @param units The sent ship in this event
   */
  private static getSlowestShipSpeed(units: IShipUnits): number {
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
  private static getDestinationTypeID(type: string): number {
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
  public router: Router;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.init();
  }

  public createEvent(request: IAuthorizedRequest, response: Response, next: NextFunction) {
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

    // validate JSON against schema
    if (!jsonValidator.validate(eventData, eventSchema).valid) {
      return response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid json",
        data: {},
      });
    }

    // check if sender of event == currently authenticated user
    if (request.userID !== eventData.ownerID) {
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

    let planetQuery: string = squel
      .select()
      .from("planets")
      .where("galaxy = ?", eventData.data.origin.galaxy)
      .where("system = ?", eventData.data.origin.system)
      .where("planet = ?", eventData.data.origin.planet)
      .where("planet_type = ?", eventData.data.origin.type === "planet" ? 1 : 2)
      .where("ownerID = ?", request.userID)
      .toString();

    // check if origin-planet exists and the user owns it
    Database.query(planetQuery)
      .then(planet => {
        const startPlanet = planet[0];

        // planet does not exist or player does not own it
        if (!InputValidator.isSet(startPlanet)) {
          return response.status(Globals.Statuscode.BAD_REQUEST).json({
            status: Globals.Statuscode.BAD_REQUEST,
            message: "Invalid parameter",
            data: {},
          });
        }

        // get the destination-planet
        planetQuery = squel
          .select()
          .from("planets")
          .where("galaxy = ?", eventData.data.destination.galaxy)
          .where("system = ?", eventData.data.destination.system)
          .where("planet = ?", eventData.data.destination.planet)
          .where("planet_type = ?", eventData.data.destination.type === "planet" ? 1 : 2)
          .toString();

        // gather data about destination
        Database.query(planetQuery)
          .then(results => {
            const destinationPlanet = results[0];

            // destination does not exist
            if (!InputValidator.isSet(destinationPlanet) && eventData.mission !== "colonize") {
              return response.status(Globals.Statuscode.BAD_REQUEST).json({
                status: Globals.Statuscode.BAD_REQUEST,
                message: "Destination does not exist",
                data: {},
              });
            }

            // calculate distance
            const distance = EventRouter.calculateDistance(eventData.data.origin, eventData.data.destination);

            const gameConfig = require("../config/game.json");

            const slowestShipSpeed = EventRouter.getSlowestShipSpeed(eventData.data.ships);

            // calculate duration of flight
            const timeOfFlight = EventRouter.calculateTimeOfFlight(
              gameConfig.speed,
              eventData.speed,
              distance,
              slowestShipSpeed,
            );

            // set start-time
            eventData.starttime = Math.round(+new Date() / 1000);

            // set end-time
            eventData.endtime = Math.round(eventData.starttime + timeOfFlight);

            // store event in database
            const eventQuery: string = squel
              .insert()
              .into("flights")
              .set("ownerID", eventData.ownerID)
              .set("mission", EventRouter.getMissionTypeID(eventData.mission))
              .set("fleetlist", JSON.stringify(eventData.data.ships))
              .set("start_id", startPlanet.planetID)
              .set("start_type", EventRouter.getDestinationTypeID(eventData.data.origin.type))
              .set("start_time", eventData.starttime)
              .set("end_id", destinationPlanet.planetID)
              .set("end_type", EventRouter.getDestinationTypeID(eventData.data.destination.type))
              .set("end_time", eventData.endtime)
              .set("loaded_metal", eventData.data.loadedRessources.metal)
              .set("loaded_crystal", eventData.data.loadedRessources.crystal)
              .set("loaded_deuterium", eventData.data.loadedRessources.deuterium)
              .toString();

            Database.query(eventQuery).then((result: any) => {
              // add event to redis-queue
              Redis.getConnection().zadd("eventQueue", result.insertId.toString(), eventData.endtime.toString());

              eventData.eventID = parseInt(result.insertId, 10);

              // all done
              return response.status(Globals.Statuscode.SUCCESS).json({
                status: Globals.Statuscode.SUCCESS,
                message: "Event successfully created.",
                data: eventData,
              });
            });
          })
          .catch(error => {
            Logger.error(error);

            return response.status(Globals.Statuscode.SERVER_ERROR).json({
              status: Globals.Statuscode.SERVER_ERROR,
              message: `An error occured: ${error.message}`,
              data: eventData,
            });
          });
      })
      .catch(error => {
        Logger.error(error);

        return response.status(Globals.Statuscode.SERVER_ERROR).json({
          status: Globals.Statuscode.SERVER_ERROR,
          message: `An error occured: ${error.message}`,
          data: eventData,
        });
      });
  }

  public cancelEvent(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    if (!InputValidator.isSet(request.body.eventID) || !InputValidator.isValidInt(request.body.eventID)) {
      return response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid parameter",
        data: {},
      });
    }

    const planetQuery: string = squel
      .select()
      .from("flights")
      .where("flightID = ?", request.body.eventID)
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
          .table("flights")
          .set("start_id", event.end_id)
          .set("start_type", event.end_type)
          .set("start_time", Math.round(+new Date() / 1000))
          .set("end_id", event.start_id)
          .set("end_type", event.start_type)
          .set("end_time", newEndTime)
          .set("`returning`", 1)
          .where("flightID = ?", request.body.eventID)
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
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  public init() {
    this.router.post("/create/", this.createEvent);
    this.router.post("/cancel/", this.cancelEvent);
  }
}

const eventRouter = new EventRouter();
eventRouter.init();

export default eventRouter.router;
