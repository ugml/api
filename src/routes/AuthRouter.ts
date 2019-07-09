import { NextFunction, Request, Response, Router } from "express";

import { Database } from "../common/Database";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { JwtHelper } from "../common/JwtHelper";

import squel = require("squel");
const bcrypt = require("bcryptjs");

import { Logger } from "../common/Logger";

export class AuthRouter {
  public router: Router;

  public constructor() {
    this.router = Router();
    this.init();
  }

  /***
   * Validates the passed login-data. If the data is valid,
   * a new JWT-token is returned.
   * @param req
   * @param response
   * @param next
   */
  public async authenticate(req: Request, response: Response, next: NextFunction) {
    try {
      if (!InputValidator.isSet(req.body.email) || !InputValidator.isSet(req.body.password)) {
        response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });

        return;
      }

      const email: string = InputValidator.sanitizeString(req.body.email);

      const password: string = InputValidator.sanitizeString(req.body.password);

      const query: string = squel
        .select({ autoQuoteFieldNames: true })
        .field("userID")
        .field("email")
        .field("password")
        .from("users")
        .where("email = ?", email)
        .toString();

      let [rows, ignore] = await Database.getConnectionPool().query(query);

      if (!InputValidator.isSet(rows) || rows[0] === undefined) {
        response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
          status: Globals.Statuscode.NOT_AUTHORIZED,
          message: "Authentication failed",
          data: {},
        });
        return;
      }

      bcrypt.compare(password, rows[0].password).then(function(isValidPassword: boolean) {
        if (!isValidPassword) {
          response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
            status: Globals.Statuscode.NOT_AUTHORIZED,
            message: "Authentication failed",
            data: {},
          });
          return;
        }

        response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Success",
          data: {
            token: JwtHelper.generateToken(rows[0].userID),
          },
        });
        return;
      });
    } catch (err) {
      Logger.error(err);

      // return the result
      response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: `There was an error: ${err.message}`,
        data: {},
      });

      return;
    }
  }

  /***
   * Initializes the routes
   */
  public init() {
    this.router.post("/login", this.authenticate);
  }
}

const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes.router;
