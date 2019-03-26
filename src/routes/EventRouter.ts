import {Router, Request, Response, NextFunction} from "express";
import { BaseRouter } from "./BaseRouter";
import { Database } from "../common/Database";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import { Validator } from "../common/ValidationTools";
import { Redis } from "../common/Redis";
import {start} from "repl";




const eventSchema = require("../../event.schema.json");

export class EventRouter extends BaseRouter {
    router: Router

    /**
     * Initialize the Router
     */
    constructor() {
        super();
        this.router = Router();
        this.init();
    }


    public createEvent(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        let jsonObj = JSON.parse(request.query.event);

        // validate JSON against schema
        if(!this.jsonValidator.validate(jsonObj, eventSchema).valid) {
            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
            return;
        }

        // client -> createEvent -> api
        // api -> check json -> send to redis
        // eventQueue -> eventhandler process -> write result into eventqueue

        if(request.userID !== jsonObj.ownerID) {
            response.json({
                status: 401,
                message: "Event-creator is not currently authenticated user",
                data: {}
            });
            return;
        }


        let startPlanetQuery = squel.select()
            .from("planets")
            .where("`ownerID` = "+request.userID)
            .where("`galaxy` = "+jsonObj.data.origin.galaxy)
            .where("`system` = "+jsonObj.data.origin.system)
            .where("`planet` = "+jsonObj.data.origin.planet).toString();

        Database.getConnection().query(startPlanetQuery, function(err, results) {
            const startPlanet = results[0];

            if(!inputValidator.isSet(startPlanet)) {
                response.json({
                    status: 401,
                    message: "Authentication failed",
                    data: {}
                });
            }



        });



        // check if owner exists and sender of event = owner
        // const query : string = "SELECT * FROM `planets` WHERE `ownerID` = "+request.userID+" AND `galaxy` = "+jsonObj.data.origin.galaxy+" AND `system` = "+jsonObj.data.origin.system+" AND `planet` = "+jsonObj.data.origin.planet+";";

        // let startPlanet = Database.getConnection().query(query).then( result => {
        //
        //         if(!inputValidator.isSet(result[0].planetID)) {
        //             response.json({
        //                 status: 400,
        //                 message: "Invalid startplanet",
        //                 data: {}
        //             });
        //             return;
        //         }
        //
        //         return result[0];
        //
        //     });


        // console.log(startPlanet);


        // if returning = false, check if eventOwner = owner of origin
        // check if destination exists
        //      if not, check if mission is colonize
        // check, if any ships are sent




        // set starttime
        // calculate endtime




        response.json({
            status: 200,
            message: "Valid schema",
            data: {}
        });



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
