import { Response, Router } from "express";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IRequest from "../interfaces/IRequest";
import ILogger from "../interfaces/ILogger";
import IAuthenticationService from "../services/AuthenticationService";
import InvalidParameterException from "../exceptions/InvalidParameterException";
import Exception from "../exceptions/Exception";

/**
 * Defines routes for authentication
 */
export default class AuthRouter {
  public router: Router = Router();

  private authenticationService: IAuthenticationService;
  private logger: ILogger;

  /**
   * Registers the routes and needed Services
   * @param container the IoC-container with registered Services
   * @param logger
   */
  public constructor(container, logger: ILogger) {
    this.authenticationService = container.authenticationService;
    this.router.post("/login", this.authenticate);
    this.logger = logger;
  }

  /**
   * Validates the passed login-data. If the data is valid,
   * a new JWT-token is returned.
   * @param req
   * @param response
   */
  public authenticate = async (req: IRequest, response: Response) => {
    try {
      if (!InputValidator.isSet(req.body.email) || !InputValidator.isSet(req.body.password)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const email: string = InputValidator.sanitizeString(req.body.email);
      const password: string = InputValidator.sanitizeString(req.body.password);

      return response.status(Globals.Statuscode.SUCCESS).json({
        token: await this.authenticationService.authenticate(email, password),
      });
    } catch (error) {
      if (error instanceof Exception) {
        return response.status(error.statusCode).json({
          error: error.message,
        });
      }

      this.logger.error(error.message, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request",
      });
    }
  };
}
