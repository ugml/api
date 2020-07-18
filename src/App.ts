import "reflect-metadata";
import * as bodyParser from "body-parser";
import * as express from "express";
const { expressCspHeader, INLINE, NONE, SELF } = require("express-csp-header");
import ILogger from "./interfaces/ILogger";
import * as dotenv from "dotenv";
import * as helmet from "helmet";
import { RegisterRoutes } from "./tsoa/routes";
import { inject } from "inversify";
import TYPES from "./ioc/types";

dotenv.config();

const noCache = require("nocache");

export default class App {
  public express: express.Express;
  @inject(TYPES.ILogger) private logger: ILogger;

  public constructor() {
    this.express = express();

    this.allowCors();
    this.middleware();
    this.startSwagger();

    RegisterRoutes(this.express);
  }

  private startSwagger(): void {
    const swaggerDocument = require("./tsoa/swagger.json");
    const swaggerUi = require("swagger-ui-express");

    this.express.use(
      expressCspHeader({
        directives: {
          "default-src": [SELF, INLINE],
          "script-src": [SELF, INLINE],
          "style-src": [SELF, INLINE],
          "img-src": ["data:", "*"],
          "worker-src": [SELF, INLINE, "*"],
          "block-all-mixed-content": true,
        },
      }),
    );

    this.express.use("/v1/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
