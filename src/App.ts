import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import { JwtHelper } from "./common/JwtHelper";

const jwt = new JwtHelper();

require('dotenv-safe').config();


import { IAuthorizedRequest } from "./interfaces/IAuthorizedRequest"

import AuthRouter from './routes/AuthRouter';
import PlayerRouter from "./routes/PlayersRouter";
import PlanetRouter from "./routes/PlanetsRouter";
import BuildingRouter from "./routes/BuildingsRouter";
import TechsRouter from "./routes/TechsRouter";
import ShipsRouter from "./routes/ShipsRouter";
import DefenseRouter from "./routes/DefenseRouter";


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
    }

    // Configure API endpoints.
    private routes(): void {

        let self = this;

        // check, if request contains valid jwt-token
        this.express.use('/*', (request, response, next) => {

            // if the user tries to authenticate, we don't have a token yet
            if(!request.originalUrl.toString().includes("\/auth\/") &&
                !request.originalUrl.toString().includes("\/players\/create\/")) {

                const authString = request.header("authorization");

                const payload : string = jwt.validateToken(authString);

                if(payload !== "" && payload !== undefined) {

                    self.userID = eval(payload).userID;
                    next();
                } else {
                    return response.json({
                        status: 401,
                        message: "Authentication failed",
                        data: {}
                    });
                }
            } else {
                next();
            }

        });


        // this.express.use('/', router);
        this.express.use('/v1/auth', AuthRouter);

        this.express.use('/v1/players', function (req : IAuthorizedRequest, res, next) {
            req.userID = self.userID;
            next();
        }, PlayerRouter);

        this.express.use('/v1/planets', function (req : IAuthorizedRequest, res, next) {
            req.userID = self.userID;
            next();
        }, PlanetRouter);

        this.express.use('/v1/buildings', function (req : IAuthorizedRequest, res, next) {
            req.userID = self.userID;
            next();
        }, BuildingRouter);

        this.express.use('/v1/techs', function (req : IAuthorizedRequest, res, next) {
            req.userID = self.userID;
            next();
        }, TechsRouter);

        this.express.use('/v1/ships', function (req : IAuthorizedRequest, res, next) {
            req.userID = self.userID;
            next();
        }, ShipsRouter);

        this.express.use('/v1/defense', function (req : IAuthorizedRequest, res, next) {
            req.userID = self.userID;
            next();
        }, DefenseRouter);
    }

}

export default new App().express;
