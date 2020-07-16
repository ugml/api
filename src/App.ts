import "reflect-metadata";
import * as bodyParser from "body-parser";
import * as express from "express";
import ILogger from "./interfaces/ILogger";
import * as dotenv from "dotenv";
import * as helmet from "helmet";
import { RegisterRoutes } from "./tsoa/routes";
import { inject } from "inversify";
import TYPES from "./ioc/types";

dotenv.config();

const noCache = require("nocache");

/**
 * Creates and configures an ExpressJS web server.
 */
export default class App {
  public express: express.Express;
  @inject(TYPES.ILogger) private logger: ILogger;

  /**
   * Creates and configures a new App-instance
   * @param logger Instance of an ILogger-object
   */
  public constructor() {
    this.express = express();
    this.middleware();
    this.startSwagger();
    this.allowCors();

    RegisterRoutes(this.express);
  }

  private startSwagger(): void {
    const swaggerDocument = require("./tsoa/swagger.json");
    const swaggerUi = require("swagger-ui-express");

    this.express.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private allowCors() {
    this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, apikey, x-access-token",
      );
      next();
    });
  }

  /**
   * Registers middleware
   */
  private middleware(): void {
    this.express.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );
    this.express.use(bodyParser.json());
    this.express.use(helmet.hidePoweredBy());
    this.express.use(noCache());
    this.express.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
        },
      }),
    );
  }
}
