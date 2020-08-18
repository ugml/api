import * as bodyParser from "body-parser";
import * as express from "express";
import { Response as ExResponse, Request as ExRequest, NextFunction } from "express";

import ILogger from "./interfaces/ILogger";
import * as dotenv from "dotenv";
import * as helmet from "helmet";
import { RegisterRoutes } from "./tsoa/routes";
import { inject } from "inversify";
import TYPES from "./ioc/types";

import { expressCspHeader, INLINE, SELF } from "express-csp-header";
import { ValidateError } from "tsoa";
import { Globals } from "./common/Globals";

dotenv.config();

export default class App {
  public express: express.Express;
  @inject(TYPES.ILogger) private logger: ILogger;

  public constructor() {
    this.express = express();

    this.allowCors();
    this.middleware();
    this.startSwagger();

    this.express.use(function(req, res, next) {
      res.header("Content-Type", "application/json");
      next();
    });

    RegisterRoutes(this.express);

    this.registerErrorHandler();

    this.registerNotFoundHandler();
  }

  private registerErrorHandler() {
    this.express.use(function ErrorHandler(
      err: unknown,
      req: ExRequest,
      res: ExResponse,
      next: NextFunction,
    ): ExResponse | void {
      if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(Globals.StatusCodes.BAD_REQUEST).json({
          error: "Validation failed",
          details: err?.fields,
        });
      }
      if (err instanceof Error) {
        return res.status(Globals.StatusCodes.SERVER_ERROR).json({
          error: "Internal Server Error",
        });
      }

      next();
    });
  }

  private registerNotFoundHandler() {
    this.express.use(function(req, res) {
      res.status(404);

      res.send({ error: "Not found" });
    });
  }

  private startSwagger(): void {
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

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerDocument = require("./tsoa/swagger.json");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerUi = require("swagger-ui-express");

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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const noCache = require("nocache");

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
