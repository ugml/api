import { NextFunction, Request, Response, Router } from "express";

import { Database } from "../common/Database";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { JwtHelper } from "../common/JwtHelper";

const squel = require("squel");
const jwt = new JwtHelper();
const bcrypt = require("bcryptjs");

const Logger = require("../common/Logger");

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
  public authenticate(req: Request, response: Response, next: NextFunction) {
    if (!InputValidator.isSet(req.body.email) || !InputValidator.isSet(req.body.password)) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
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

    Database.query(query)
      .then(users => {
        if (!InputValidator.isSet(users)) {
          response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
            status: Globals.Statuscode.NOT_AUTHORIZED,
            message: "Authentication failed",
            data: {},
          });
          return;
        }

        bcrypt.compare(password, users[0].password).then(function(isValidPassword) {
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
              token: jwt.generateToken(users[0].userID),
            },
          });
          return;
        });
      })
      .catch(err => {
        Logger.error(err);

        // return the result
        response.status(Globals.Statuscode.SERVER_ERROR).json({
          status: Globals.Statuscode.SERVER_ERROR,
          message: `There was an error: ${err.message}`,
          data: {},
        });

        return;
      });
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
