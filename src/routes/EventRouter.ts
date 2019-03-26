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

        // check if owner exists and sender of event = owner
        if(request.userID !== eventData.ownerID) {
            response.json({
                status: 401,
                message: "Event-creator is not currently authenticated user",
                data: {}
            });

            return;
        }

        let planetQuery = squel.select()
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

            let planetQuery = squel.select()
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
                console.log("distance: " + distance);


                // calculate duration of flight
                // TODO

                // set start-time
                // TODO

                // set end-time
                eventData.starttime = Math.round(+new Date / 1000);

                // add event to redis-queue
                // TODO
                // const eventDueTime = +new Date / 1000;
                //
                // Redis.getConnection().zpopmin("eventQueue", function (error, result) {
                //     if (error) {
                //         console.log(error);
                //         throw error;
                //     }
                //     console.log('GET result ->' + result);
                // });
                //
                // Redis.getConnection().zadd("eventQueue", eventDueTime.toString(), "{\"dueDate\":\"" + eventDueTime.toString() + "\"}");
                //
                // console.log(eventDueTime.toString() + " -> " +  "{\"dueDate\":\"" + eventDueTime.toString() + "\"}");

                // return result
                response.json({
                    status: 200,
                    message: "success",
                    data: eventData
                });
            });
        });

    }

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
