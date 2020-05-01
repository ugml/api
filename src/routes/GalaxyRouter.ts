import { Response, Router } from "express";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import ILogger from "../interfaces/ILogger";
import IGalaxyDataAccess from "../interfaces/dataAccess/IGalaxyDataAccess";
import InvalidParameterException from "../exceptions/InvalidParameterException";
import Exception from "../exceptions/Exception";

/**
 * Defines routes for galaxy-data
 */
export default class GalaxyRouter {
  public router: Router = Router();
  private logger: ILogger;
  private galaxyDataAccess: IGalaxyDataAccess;

  public constructor(container, logger: ILogger) {
    this.galaxyDataAccess = container.galaxyDataAccess;
    this.router.get("/:posGalaxy/:posSystem", this.getGalaxyInformation);

    this.logger = logger;
  }

  public getGalaxyInformation = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (
        !InputValidator.isValidInt(request.params.posGalaxy) ||
        !InputValidator.isValidInt(request.params.posSystem)
      ) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const posGalaxy = parseInt(request.params.posGalaxy, 10);
      const posSystem = parseInt(request.params.posSystem, 10);

      if (!InputValidator.isValidPosition(posGalaxy, posSystem)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const galaxyData = await this.galaxyDataAccess.getGalaxyInfo(posGalaxy, posSystem);

      return response.status(Globals.Statuscode.SUCCESS).json(galaxyData ?? {});
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
