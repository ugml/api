import * as bodyParser from "body-parser";
import * as express from "express";
import { Router } from "express";
import { JwtHelper } from "./common/JwtHelper";
import { IAuthorizedRequest } from "./interfaces/IAuthorizedRequest";

import { Globals } from "./common/Globals";
import { IJwt } from "./interfaces/IJwt";
import { InputValidator } from "./common/InputValidator";
import AuthRouter from "./routes/AuthRouter";
import BuildingRouter from "./routes/BuildingsRouter";
import ConfigRouter from "./routes/ConfigRouter";
import DefenseRouter from "./routes/DefenseRouter";
import EventRouter from "./routes/EventRouter";
import GalaxyRouter from "./routes/GalaxyRouter";
import MessagesRouter from "./routes/MessagesRouter";
import PlanetRouter from "./routes/PlanetsRouter";
import PlayerRouter from "./routes/PlayersRouter";
import ShipsRouter from "./routes/ShipsRouter";
import TechsRouter from "./routes/TechsRouter";
import dotenv = require("dotenv-safe");

dotenv.config({
  example: process.env.CI ? ".env.ci.example" : ".env.example",
});

const expressip = require("express-ip");
const helmet = require("helmet");

const winston = require("winston");
const expressWinston = require("express-winston");

const { format } = winston;
const { combine, printf } = format;

import { Logger } from "./common/Logger";

const logFormat = printf(({ message, timestamp }) => {
  return `${timestamp} [REQUEST] ${message}`;
});

// Creates and configures an ExpressJS web server.
class App {
  // ref to Express instance
  public express: express.Application;
  public userID: string;

  // Run configuration methods on the Express instance.
  public constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    this.express.use(helmet.hidePoweredBy());
    this.express.use(helmet.noCache());
    this.express.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
        },
      }),
    );
  }

  // Configure API endpoints.
  private routes(): void {
    const self = this;

    this.express.use("/*", (request, response, next) => {
      try {
        // if the user tries to authenticate, we don't have a token yet
        if (
          !request.originalUrl.toString().includes("/auth/") &&
          !request.originalUrl.toString().includes("/users/create/") &&
          !request.originalUrl.toString().includes("/config/")
        ) {
          const authString = request.header("authorization");

          if (
            !InputValidator.isSet(authString) ||
            !authString.match("([a-zA-Z0-9\\-\\_]+\\.[a-zA-Z0-9\\-\\_]+\\.[a-zA-Z0-9\\-\\_]+)")
          ) {
            response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
              status: Globals.Statuscode.NOT_AUTHORIZED,
              message: "Authentication failed",
              data: {},
            });
            return;
          }

          const token: string = authString.match("([a-zA-Z0-9\\-\\_]+\\.[a-zA-Z0-9\\-\\_]+\\.[a-zA-Z0-9\\-\\_]+)")[0];

          const payload: IJwt = JwtHelper.validateToken(token);

          if (InputValidator.isSet(payload)) {
            self.userID = payload.userID.toString(10);

            // check if userID is a valid integer
            if (isNaN(parseInt(self.userID, 10))) {
              response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {},
              });

              return;
            } else {
              next();
            }
          } else {
            response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
              status: Globals.Statuscode.NOT_AUTHORIZED,
              message: "Authentication failed",
              data: {},
            });

            return;
          }
        } else {
          next();
        }
      } catch (e) {
        Logger.error(e);

        response.status(Globals.Statuscode.SERVER_ERROR).json({
          status: Globals.Statuscode.SERVER_ERROR,
          message: "Internal server error",
          data: {},
        });

        return;
      }
    });

    expressWinston.bodyBlacklist.push("password");

    // TODO: find better method to filter out passwords in requests
    this.express.use(
      expressWinston.logger({
        transports: [
          new winston.transports.Console(),
          new winston.transports.File({ filename: `${Logger.getPath()}access.log` }),
        ],
        format: combine(
          format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
          }),
          logFormat,
        ),
        maxsize: 10,
        msg:
          "{" +
          "'ip': '{{req.connection.remoteAddress}}', " +
          "'userID': '{{req.userID}}', " +
          "'method': '{{req.method}}', " +
          "'url': '{{req.url}}', " +
          "'params': { " +
          "'query:': {{JSON.stringify(req.params || {}).replace(/(,\"password\":)(\")(.*)(\")/g, '') }}, " +
          "'body': {{JSON.stringify(req.body || {}).replace(/(,\"password\":)(\")(.*)(\")/g, '') }} " +
          "}" +
          "}",
      }),
    );

    this.register("/v1/config", ConfigRouter);

    this.register("/v1/auth", AuthRouter);

    this.register("/v1/user", PlayerRouter);

    this.register("/v1/users", PlayerRouter);

    this.register("/v1/planet", PlanetRouter);

    this.register("/v1/planets", PlanetRouter);

    this.register("/v1/buildings", BuildingRouter);

    this.register("/v1/techs", TechsRouter);

    this.register("/v1/ships", ShipsRouter);

    this.register("/v1/defenses", DefenseRouter);

    this.register("/v1/events", EventRouter);

    this.register("/v1/galaxy", GalaxyRouter);

    this.register("/v1/messages", MessagesRouter);

    this.express.use(function(request, response) {
      response.status(Globals.Statuscode.NOT_FOUND).json({
        status: Globals.Statuscode.NOT_FOUND,
        message: "The route does not exist",
        data: {},
      });

      return;
    });
  }

  private register(route: string, router: Router) {
    const self = this;

    this.express.use(
      route,
      function(req: IAuthorizedRequest, res, next) {
        req.userID = self.userID;
        next();
      },
      router,
    );
  }
}

export default new App().express;
