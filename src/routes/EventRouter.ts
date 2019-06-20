import { NextFunction, Response, Router } from "express";
import { Database } from "../common/Database";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { Redis } from "../common/Redis";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { ICoordinates } from "../interfaces/ICoordinates";
import { IShipUnits } from "../interfaces/IShipUnits";

const JSONValidator = require("jsonschema").Validator;
const jsonValidator = new JSONValidator();
import squel = require("squel");

import { Logger } from "../common/Logger";

const eventSchema = require("../schemas/fleetevent.schema.json");

// TODO: validate input data:
//  is start != end?
//  is missionSpeed % 10 = 0 and 0 <= missionSpeed <= 100 (should already be handled by schema)
//  units.json => check all values (capacity, etc).
//  loaded resources > storage?

export class EventRouter {
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
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    const eventData = JSON.parse(request.body.event);

    // validate JSON against schema
    if (!jsonValidator.validate(eventData, eventSchema).valid) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "Invalid json",
        data: {},
      });

      return;
    }

    // check if sender of event == currently authenticated user
    if (request.userID !== eventData.ownerID) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "Event-creator is not currently authenticated user",
        data: {},
      });

      return;
    }

    // TODO: temporary
    if (["deploy", "acs", "hold", "harvest", "espionage", "destroy"].indexOf(eventData.mission) >= 0) {
      response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "Missiontype not yet supported",
        data: {},
      });

      return;
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
      .then(results => {
        const startPlanet = results[0];

        // planet does not exist or player does not own it
        if (!InputValidator.isSet(startPlanet)) {
          response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
            status: Globals.Statuscode.NOT_AUTHORIZED,
            message: "Invalid parameter",
            data: {},
          });

          return;
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
              response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Destination does not exist",
                data: {},
              });

              return;
            }

            // calculate distance
            const distance = eventRouter.calculateDistance(eventData.data.origin, eventData.data.destination);

            const gameConfig = require("../config/game.json");

            const slowestShipSpeed = eventRouter.getSlowestShipSpeed(eventData.data.ships);

            console.log(slowestShipSpeed);

            // calculate duration of flight
            const timeOfFlight = eventRouter.calculateTimeOfFlight(
              gameConfig.speed,
              eventData.speed,
              distance,
              slowestShipSpeed,
            );

            console.log(timeOfFlight);

            // set start-time
            eventData.starttime = Math.round(+new Date() / 1000);

            // set end-time
            eventData.endtime = Math.round(eventData.starttime + timeOfFlight);

            // store event in database
            const eventQuery: string = squel
              .insert()
              .into("flights")
              .set("ownerID", eventData.ownerID)
              .set("mission", eventRouter.getMissionTypeID(eventData.mission))
              .set("fleetlist", JSON.stringify(eventData.data.ships))
              .set("start_id", startPlanet.planetID)
              .set("start_type", eventRouter.getDestinationTypeID(eventData.data.origin.type))
              .set("start_time", eventData.starttime)
              .set("end_id", destinationPlanet.planetID)
              .set("end_type", eventRouter.getDestinationTypeID(eventData.data.destination.type))
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
              response.status(Globals.Statuscode.SUCCESS).json({
                status: Globals.Statuscode.SUCCESS,
                message: "Event successfully created.",
                data: eventData,
              });
              return;
            });
          })
          .catch(error => {
            Logger.error(error);

            response.status(Globals.Statuscode.SERVER_ERROR).json({
              status: Globals.Statuscode.SERVER_ERROR,
              message: `An error occured: ${error.message}`,
              data: eventData,
            });
            return;
          });
      })
      .catch(error => {
        Logger.error(error);

        response.status(Globals.Statuscode.SERVER_ERROR).json({
          status: Globals.Statuscode.SERVER_ERROR,
          message: `An error occured: ${error.message}`,
          data: eventData,
        });
        return;
      });
  }

  public cancelEvent(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    if (!InputValidator.isSet(request.body.eventID) || !InputValidator.isValidInt(request.body.eventID)) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "Invalid parameter",
        data: {},
      });

      return;
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
          response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
            status: Globals.Statuscode.NOT_AUTHORIZED,
            message: "The event does not exist or can't be canceled",
            data: {},
          });

          return;
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

        Database.query(updateQuery).then(result => {
          // remove the event from the redis-queue
          Redis.getConnection().zremrangebyscore("eventQueue", request.body.eventID, request.body.eventID);

          // add the event with the new endtime
          Redis.getConnection().zadd("eventQueue", request.body.eventID, newEndTime);

          // all done
          response.status(Globals.Statuscode.SUCCESS).json({
            status: Globals.Statuscode.SUCCESS,
            message: "Event successfully canceled.",
            data: {},
          });
          return;
        });
      })
      .catch(error => {
        Logger.error(error);

        response.status(Globals.Statuscode.SERVER_ERROR).json({
          status: Globals.Statuscode.SERVER_ERROR,
          message: `An error occured: ${error.message}`,
          data: {},
        });
        return;
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

  // TODO: relocate to own file with other game-related calculations
  /**
   * Calculates the distances between two planets
   * Source: http://www.owiki.de/index.php?title=Entfernung
   * @param origin The first planet
   * @param destination The second planet
   */
  private calculateDistance(origin: ICoordinates, destination: ICoordinates): number {
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
  private calculateTimeOfFlight(
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
  private getDestinationTypeID(type: string): number {
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

const eventRouter = new EventRouter();
eventRouter.init();

export default eventRouter.router;
