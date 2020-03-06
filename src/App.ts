import * as bodyParser from "body-parser";
import * as express from "express";
import * as cors from "cors";
import { Router } from "express";
import JwtHelper from "./common/JwtHelper";
import Redis from "./common/Redis";
import IAuthorizedRequest from "./interfaces/IAuthorizedRequest";
import { Globals } from "./common/Globals";
import IJwt from "./interfaces/IJwt";
import ILogger from "./interfaces/ILogger";
import RequestLogger from "./loggers/RequestLogger";
import InputValidator from "./common/InputValidator";
import AuthRouter from "./routes/AuthRouter";
import BuildingRouter from "./routes/BuildingsRouter";
import ConfigRouter from "./routes/ConfigRouter";
import DefenseRouter from "./routes/DefenseRouter";
import EventRouter from "./routes/EventRouter";
import GalaxyRouter from "./routes/GalaxyRouter";
import MessagesRouter from "./routes/MessagesRouter";
import PlanetRouter from "./routes/PlanetsRouter";
import UsersRouter from "./routes/UsersRouter";
import ShipsRouter from "./routes/ShipsRouter";
import TechsRouter from "./routes/TechsRouter";
import dotenv = require("dotenv");

dotenv.config();

const helmet = require("helmet");

const apiConfig = require("./config/apiconfig.json");

const winston = require("winston");
const expressWinston = require("express-winston");

const { format } = winston;
const { combine, printf } = format;

const logFormat = printf(({ message, timestamp }) => {
  return `${timestamp} [REQUEST] ${message}`;
});

const productionMode = process.env.NODE_ENV === "production";

/**
 * Creates and configures an ExpressJS web server.
 */
export default class App {
  public express: express.Application;
  public userID: string;
  public container;
  private logger: ILogger;

  /**
   * Creates and configures a new App-instance
   * @param container the IoC-container with registered services
   * @param logger Instance of an ILogger-object
   */
  public constructor(container, logger: ILogger) {
    this.logger = logger;
    this.container = container;
    this.express = express();
    this.middleware();
    this.routes();
    // TODO: await this call
    this.loadEventsIntoQueue();
  }

  /**
   * Loads all events from the database into the eventqueue
   */
  private async loadEventsIntoQueue(): Promise<void> {
    this.logger.info("Loading unprocessed events into Queue");

    const eventService = this.container.eventService;

    const eventList = await eventService.getAllUnprocessedEvents();

    for (const event of eventList) {
      Redis.getClient().zadd("eventQueue", event.endTime, event.eventID);
    }

    this.logger.info(`Finished loading ${eventList.length} events into Queue`);
  }

  /**
   * Registers middleware
   */
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    /**
     * Check if given origin is whitelisted
     * @param checkOrigin
     * @param callback
     */
    function corsHandler(checkOrigin: string, callback) {
      if (apiConfig.cors.whitelist.indexOf(checkOrigin) === -1 && checkOrigin) {
        return callback(new Error(`CORS "${checkOrigin}" is not whitelisted`));
      }
      callback(null, true);
    }

    this.express.use(function(req, res, next) {
      cors({
        origin: productionMode ? corsHandler : req.headers.origin,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST"],
        credentials: true,
      })(req, res, next);
    });

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

  /**
   * Configure API endpoints
   */
  private routes(): void {
    const self = this;

    this.express.use("/*", (request: IAuthorizedRequest, response, next) => {
      try {
        this.logger.info(
          "{" +
            `'ip': '${request.headers["x-real-ip"] || request.connection.remoteAddress}', ` +
            `'method': '${request.method}', ` +
            `'url': '${request.url}', ` +
            `'userID': '${request.userID}', ` +
            "'params': { " +
            `'query:': ${JSON.stringify(request.params || {}).replace(/(,\"password\":)(\")(.*)(\")/g, "")}, ` +
            `'body': ${JSON.stringify(request.body || {}).replace(/(,\"password\":)(\")(.*)(\")/g, "")}` +
            "}" +
            "}",
        );

        // if the user tries to authenticate, we don't have a token yet
        // TODO: Replace with whitelist of urls, which don't need a token
        if (
          !request.originalUrl.toString().includes("/auth/") &&
          !request.originalUrl.toString().includes("/users/create/") &&
          !request.originalUrl.toString().includes("/config/") &&
          !request.originalUrl.toString().includes("/user/forgot") &&
          !request.originalUrl.toString().includes("/user/resetPassword")
        ) {
          const authString = request.header("authorization");

          if (
            !InputValidator.isSet(authString) ||
            !authString.match("([a-zA-Z0-9\\-\\_]+\\.[a-zA-Z0-9\\-\\_]+\\.[a-zA-Z0-9\\-\\_]+)")
          ) {
            return response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
              error: "Authentication failed",
            });
          }

          const token: string = authString.match("([a-zA-Z0-9\\-\\_]+\\.[a-zA-Z0-9\\-\\_]+\\.[a-zA-Z0-9\\-\\_]+)")[0];

          const payload: IJwt = JwtHelper.validateToken(token);

          if (InputValidator.isSet(payload) && InputValidator.isSet(payload.userID)) {
            self.userID = payload.userID.toString(10);

            // check if userID is a valid integer
            if (isNaN(parseInt(self.userID, 10))) {
              return response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                error: "Invalid parameter",
              });
            } else {
              next();
            }
          } else {
            return response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
              error: "Authentication failed",
            });
          }
        } else {
          next();
        }
      } catch (error) {
        this.logger.error(error, error.stack);

        return response.status(Globals.Statuscode.SERVER_ERROR).json({
          error: "Internal server error",
        });
      }
    });

    expressWinston.bodyBlacklist.push("password");

    // TODO: find better method to filter out passwords in requests
    this.express.use(
      expressWinston.logger({
        transports: [
          new winston.transports.Console(),
          new winston.transports.File({ filename: `${RequestLogger.getPath()}access.log` }),
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
          "'ip': '{{(req.headers['x-real-ip'] || req.connection.remoteAddress)}}', " +
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

    this.register("/v1/config", new ConfigRouter(this.logger).router);

    this.register("/v1/auth", new AuthRouter(this.container, this.logger).router);

    this.register("/v1/user", new UsersRouter(this.container, this.logger).router);

    this.register("/v1/users", new UsersRouter(this.container, this.logger).router);

    this.register("/v1/planet", new PlanetRouter(this.container, this.logger).router);

    this.register("/v1/planets", new PlanetRouter(this.container, this.logger).router);

    this.register("/v1/buildings", new BuildingRouter(this.container, this.logger).router);

    this.register("/v1/techs", new TechsRouter(this.container, this.logger).router);

    this.register("/v1/ships", new ShipsRouter(this.container, this.logger).router);

    this.register("/v1/defenses", new DefenseRouter(this.container, this.logger).router);

    this.register("/v1/events", new EventRouter(this.container, this.logger).router);

    this.register("/v1/galaxy", new GalaxyRouter(this.container, this.logger).router);

    this.register("/v1/messages", new MessagesRouter(this.container, this.logger).router);

    this.express.use(function(request, response) {
      return response.status(Globals.Statuscode.NOT_FOUND).json({
        error: "The route does not exist",
      });
    });
  }

  /**
   * Helper-function to register routes
   * @param path the path of the route
   * @param router the router which handles the requests to the given path
   */
  private register(path: string, router: Router) {
    const self = this;

    this.express.use(
      path,
      function(req: IAuthorizedRequest, res, next) {
        req.userID = self.userID;
        next();
      },
      router,
    );
  }
}
