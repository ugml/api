import {Router, Request, Response, NextFunction} from 'express';
import { Database } from '../common/db';
import { Validator } from "../common/ValidationTools";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"



const validator = new Validator();

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

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/create/', this.createEvent);
    }

}

const eventRouter = new EventRouter();
eventRouter.init();

export default eventRouter.router;
