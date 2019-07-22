import { NextFunction, Response, Router as newRouter, IRouter, Request } from "express";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import { JwtHelper } from "../common/JwtHelper";
import { Logger } from "../common/Logger";
import IRequest from "../interfaces/IRequest";

const bcrypt = require("bcrypt");

export default class AuthRouter {
  public router: IRouter<{}> = newRouter();

  private userService;

  public constructor(container) {
    this.userService = container.userService;
    this.router.post("/login", this.authenticate);
  }

  /***
   * Validates the passed login-data. If the data is valid,
   * a new JWT-token is returned.
   * @param req
   * @param response
   * @param next
   */
  public authenticate = async (req: IRequest, response: Response, next: NextFunction) => {
    try {
      if (!InputValidator.isSet(req.body.email) || !InputValidator.isSet(req.body.password)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const email: string = InputValidator.sanitizeString(req.body.email);

      const password: string = InputValidator.sanitizeString(req.body.password);

      const data = await this.userService.getUserForAuthentication(email);

      if (!InputValidator.isSet(data)) {
        return response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
          status: Globals.Statuscode.NOT_AUTHORIZED,
          message: "Authentication failed",
          data: {},
        });
      }

      const isValidPassword = await bcrypt.compare(password, data.password);

      if (!isValidPassword) {
        return response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
          status: Globals.Statuscode.NOT_AUTHORIZED,
          message: "Authentication failed",
          data: {},
        });
      }

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: {
          token: JwtHelper.generateToken(data.userID),
        },
      });
    } catch (err) {
      Logger.error(err);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: `There was an error: ${err.message}`,
        data: {},
      });
    }
  };
}
