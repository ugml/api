import {Router, Request, Response, NextFunction} from "express";
import { Database } from "../common/Database";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import { Validator } from "../common/ValidationTools";
import { Redis } from "../common/Redis";
import {start} from "repl";


const JSONValidator = require('jsonschema').Validator;
const jsonValidator = new JSONValidator();
const inputValidator = new Validator();
const squel = require("squel");

const eventSchema = require("../../event.schema.json");

// TODO: validate input data:
//  is start != end?
//  is missionSpeed % 10 = 0 and 0 <= missionSpeed <= 100 (should already be handled by schema)
//  units.json => check all values (capacity, etc).
//  loaded resources > storage?

export class EventRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    // TODO: relocate to own file with other game-related calculations
    /**
     * Calculates the distances between two planets
     * Source: http://www.owiki.de/index.php?title=Entfernung
     * @param origin The first planet
     * @param destination The second planet
     */
    private calculateDistance(origin: ICoordinates, destination : ICoordinates) : number {

        const distances = [
            Math.abs(parseInt(origin.galaxy) - parseInt(destination.galaxy)),
            Math.abs(parseInt(origin.system) - parseInt(destination.system)),
            Math.abs(parseInt(origin.planet) - parseInt(destination.planet))
        ];

        let distance : number = 0;

        if(distances[0] != 0) return distances[0] * 20000;
        if(distances[1] != 0) return distances[1] * 95 + 2700;
        if(distances[2] != 0) return distances[2] * 5 + 1000;

        return distance;
    }

    /**
     * Calculates the time of flight in seconds
     * @param gameSpeed The speed of the game (default: 3500)
     * @param missionSpeed The speed of the whole mission (possible values: 0, 10, 20, ..., 100)
     * @param distance The distance between the start and the end
     * @param slowestShipSpeed The speed of the slowest ship in the fleet
     */
    private calculateTimeOfFlight(gameSpeed : number, missionSpeed : number, distance : number, slowestShipSpeed : number) : number {
        return Math.pow((gameSpeed / (missionSpeed/100)) * (distance * 10 / slowestShipSpeed), 0.5) + 10;
    }

    /**
     * Returns the speed of the slowest ship in the fleet
     * @param units The sent ship in this event
     */
    private getSlowestShipSpeed(units : IShipUnits) : number {
        const unitData = require("../config/units.json");

        let minimum : number = Number.MAX_VALUE;

        for(let ship in units) {
            if(units[ship] > 0 && unitData.units.ships[ship].speed < minimum) {
                minimum = unitData.units.ships[ship].speed;
            }
        }

        return minimum;
    }

    /**
     * Returns the ID of the destination-type
     * @param type The type as a string (planet, moon or debris)
     */
    private getDestinationTypeID(type : string) :number {
        let typeID : number;
        switch(type) {
            case "planet":
                typeID = 1;
                break;
            case "moon":
                typeID = 2;
                break;
            case "debris":
                typeID = 3;
                break;
        }

        return typeID;
    }

    /**
     * Returns the ID of the mission-type
     * @param mission The type as a string (transport, attack, ...)
     */
    private getMissionTypeID(mission : string) :number {
        let missionTypeID : number;
        switch(mission) {
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
                break;
        }

        return missionTypeID;
    }


    public createEvent(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        let eventData = JSON.parse(request.query.event);

        // validate JSON against schema
        if(!jsonValidator.validate(eventData, eventSchema).valid) {
            response.json({
                status: 400,
                message: "Invalid json",
                data: {}
            });

            return;
        }

        // TODO: temporary
        if(["deploy", "acs", "hold", "harvest", "espionage", "destroy"].indexOf(eventData.mission) >= 0) {
            response.json({
                status: 500,
                message: "Missiontype not yet supported",
                data: {}
            });

            return;
        }

        // check if owner exists and sender of event = owner
        if(request.userID !== eventData.ownerID) {
            response.json({
                status: 401,
                message: "Event-creator is not currently authenticated user",
                data: {}
            });

            return;
        }

        let planetQuery : string = squel.select()
            .from("planets")
            .where("galaxy = ?", eventData.data.origin.galaxy)
            .where("system = ?", eventData.data.origin.system)
            .where("planet = ?", eventData.data.origin.planet)
            .where("planet_type = ?", (eventData.data.origin.type === "planet") ? 1 : 2)
            .where("ownerID = ?", eventData.ownerID)
            .toString();

        // check if origin-planet exists and the user owns it
        Database.getConnection().query(planetQuery, function(err, results) {
            const startPlanet = results[0];

            // planet does not exist or player does not own it
            if(!inputValidator.isSet(startPlanet)) {
                response.json({
                    status: 401,
                    message: "Authentication failed",
                    data: {}
                });

                return;
            }

            let planetQuery : string = squel.select()
                .from("planets")
                .where("galaxy = ?", eventData.data.destination.galaxy)
                .where("system = ?", eventData.data.destination.system)
                .where("planet = ?", eventData.data.destination.planet)
                .where("planet_type = ?", (eventData.data.destination.type === "planet") ? 1 : 2)
                .toString();

            // gather data about destination
            Database.getConnection().query(planetQuery, function(err, results) {
                const destinationPlanet = results[0];

                // destination does not exist
                if(!inputValidator.isSet(destinationPlanet) && eventData.mission !== 'colonize') {

                    response.json({
                        status: 401,
                        message: "Destination does not exist",
                        data: {}
                    });

                    return;

                }

                // calculate distance
                let distance = eventRouter.calculateDistance(eventData.data.origin, eventData.data.destination);

                const gameConfig = require("../config/game.json");

                let slowestShipSpeed = eventRouter.getSlowestShipSpeed(eventData.ships);

                // calculate duration of flight
                let timeOfFlight = eventRouter.calculateTimeOfFlight(gameConfig.speed, eventData.speed, distance, slowestShipSpeed);

                // set start-time
                eventData.starttime = Math.round(+new Date / 1000);

                // set end-time
                eventData.endtime = Math.round(eventData.starttime + timeOfFlight);

                // store event in database
                let eventQuery : string = squel.insert()
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

                Database.getConnection().query(eventQuery, function(err, result) {

                    // add event to redis-queue
                    Redis.getConnection().zadd("eventQueue", result.insertId.toString(), eventData.endtime.toString());

                    // all done
                    response.json({
                        status: 200,
                        message: "success",
                        data: eventData
                    });
                    return;
                });
            });
        });

    }

    // TODO: cancel event
    // pop from eventQueue where eventID == id of event to cancel

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/create/', this.createEvent);
    }

}

const eventRouter = new EventRouter();
eventRouter.init();

export default eventRouter.router;
