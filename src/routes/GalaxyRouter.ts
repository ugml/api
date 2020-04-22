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

  /**
   * Registers the routes and needed services
   * @param container the IoC-container with registered services
   * @param logger Instance of an ILogger-object
   */
  public constructor(container, logger: ILogger) {
    this.galaxyService = container.galaxyService;
    this.router.get("/:posGalaxy/:posSystem", this.getGalaxyInformation);

    this.logger = logger;
  }

  /**
   * Returns a list of all galaxy-entries at the given position
   * @param request
   * @param response
   * @param next
   */
  public getGalaxyInformation = async (request: IAuthorizedRequest, response: Response) => {
    try {
      // validate parameters
      if (
        !InputValidator.isSet(request.params.posGalaxy) ||
        !InputValidator.isValidInt(request.params.posGalaxy) ||
        !InputValidator.isSet(request.params.posSystem) ||
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
