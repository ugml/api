import { NextFunction, Response, Router as newRouter } from "express";
import { Globals } from "../common/Globals";
import Encryption from "../common/Encryption";
import InputValidator from "../common/InputValidator";
import JwtHelper from "../common/JwtHelper";
import Logger from "../common/Logger";
import IRequest from "../interfaces/IRequest";
import IUserService from "../interfaces/IUserService";

/**
 * Defines routes for authentication
 */
export default class AuthRouter {
  public router = newRouter();

  private userService: IUserService;

  /**
   * Registers the routes and needed services
   * @param container the IoC-container with registered services
   */
  public constructor(container) {
    this.userService = container.userService;
    this.router.post("/login", this.authenticate);
  }

  /**
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
          error: "Invalid parameter",
        });
      }

      const email: string = InputValidator.sanitizeString(req.body.email);

      const password: string = InputValidator.sanitizeString(req.body.password);

      const data = await this.userService.getUserForAuthentication(email);

      if (!InputValidator.isSet(data)) {
        return response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
          error: "Authentication failed",
        });
      }

      const isValidPassword = await Encryption.compare(password, data.password);

      if (!isValidPassword) {
        return response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
          error: "Authentication failed",
        });
      }

      return response.status(Globals.Statuscode.SUCCESS).json({
        token: JwtHelper.generateToken(data.userID),
      });
    } catch (err) {
      Logger.error(err);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        error: "There was an error while handling the request.",
      });
    }
  };
}
