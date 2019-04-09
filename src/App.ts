import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

const dotenv = require('dotenv-safe').config();

import { JwtHelper } from "./common/JwtHelper";
import { IAuthorizedRequest } from "./interfaces/IAuthorizedRequest"
import ConfigRouter from './routes/ConfigRouter';
import AuthRouter from './routes/AuthRouter';
import PlayerRouter from "./routes/PlayersRouter";
import PlanetRouter from "./routes/PlanetsRouter";
import BuildingRouter from "./routes/BuildingsRouter";
import TechsRouter from "./routes/TechsRouter";
import ShipsRouter from "./routes/ShipsRouter";
import DefenseRouter from "./routes/DefenseRouter";
import EventRouter from "./routes/EventRouter";
import {Router} from "express";
import {Globals} from "./common/Globals";


const jwt = new JwtHelper();
const expressip = require('express-ip');
const helmet = require('helmet');



// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;
    public userID: string;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        // this.express.use(expressip().getIpInfoMiddleware);

        this.express.use(helmet.hidePoweredBy());
        this.express.use(helmet.noCache());
        this.express.use(helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"]
            }
        }));


    }

    // Configure API endpoints.
    private routes(): void {
        let self = this;

        this.express.use('/*', (request, response, next) => {

            try {

                // console.log("---\r\nRequest from " + request.connection.remoteAddress.split(`:`).pop());

                // if the user tries to authenticate, we don't have a token yet
                if(!request.originalUrl.toString().includes("\/auth\/") &&
                    !request.originalUrl.toString().includes("\/users\/create\/") &&
                    !request.originalUrl.toString().includes("\/config\/")) {

                    const authString = request.header("authorization");

                    const payload : string = jwt.validateToken(authString);

                    if(payload !== "" && payload !== undefined) {

                        self.userID = eval(payload).userID;
                        next();
                    } else {
                        return response.json({
                            status: Globals.Statuscode.NOT_AUTHORIZED,
                            message: "Authentication failed",
                            data: {}
                        });

                        return;
                    }
                } else {
                    next();
                }


            } catch(e) {
                response.json({
                    status: Globals.Statuscode.SERVER_ERROR,
                    message: "Internal server error",
                    data: {}
                });

                return;
            }

        });

        this.register('/v1/config', ConfigRouter);

        this.register('/v1/auth', AuthRouter);

        this.register('/v1/user', PlayerRouter);

        this.register('/v1/users', PlayerRouter);

        this.register('/v1/planet', PlanetRouter);

        this.register('/v1/planets', PlanetRouter);

        this.register('/v1/buildings', BuildingRouter);

        this.register('/v1/techs', TechsRouter);

        this.register('/v1/ships', ShipsRouter);

        this.register('/v1/defenses', DefenseRouter);

        this.register('/v1/events', EventRouter);
    }

    private register(route : string, router : Router) {

        let self = this;

        this.express.use(route, function (req : IAuthorizedRequest, res, next) {
            req.userID = self.userID;
            next();
        }, router);
    }

}

export default new App().express;
