import {Router, Request, Response, NextFunction} from "express";
import { Database } from "../common/Database";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import { Redis } from "../common/Redis";


const Validator = require('jsonschema').Validator;
const JSONValidator = new Validator();

export class EventRouter {
    router: Router

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }


    public createEvent(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        console.log(JSON.parse(request.query.event))

        // validate JSON against schema
        if(!JSONValidator.validate(JSON.parse(request.query.event), {"type": "number"}).valid) {
            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
            return;
        }
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
