import { Response, Router } from "express";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import IGalaxyService from "../interfaces/IGalaxyService";
import ILogger from "../interfaces/ILogger";

/**
 * Defines routes for galaxy-data
 */
export default class GalaxyRouter {
  public router: Router = Router();
  private logger: ILogger;
  private galaxyService: IGalaxyService;


  public constructor(container, logger: ILogger) {
    this.galaxyService = container.galaxyService;
    this.router.get("/:posGalaxy/:posSystem", this.getGalaxyInformation);

    this.logger = logger;
  }

  public getGalaxyInformation = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (
        !InputValidator.isValidInt(request.params.posGalaxy) ||
        !InputValidator.isValidInt(request.params.posSystem)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const posGalaxy = parseInt(request.params.posGalaxy, 10);
      const posSystem = parseInt(request.params.posSystem, 10);

      if (!InputValidator.isValidPosition(posGalaxy, posSystem)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const galaxyData = await this.galaxyService.getGalaxyInfo(posGalaxy, posSystem);

      return response.status(Globals.Statuscode.SUCCESS).json(galaxyData ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };
}
