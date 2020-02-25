import { NextFunction, Response, Router as newRouter, IRouter } from "express";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import Logger from "../common/Logger";
import IGalaxyService from "../interfaces/IGalaxyService";

/**
 * Defines routes for galaxy-data
 */
export default class GalaxyRouter {
  public router = newRouter();

  private galaxyService: IGalaxyService;

  /**
   * Registers the routes and needed services
   * @param container the IoC-container with registered services
   */
  public constructor(container) {
    this.galaxyService = container.galaxyService;
    this.router.get("/:posGalaxy/:posSystem", this.getGalaxyInformation);
  }

  /**
   * Returns a list of all galaxy-entries at the given position
   * @param request
   * @param response
   * @param next
   */
  public getGalaxyInformation = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
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

      return response.status(Globals.Statuscode.SUCCESS).json(galaxyData);
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        error: "There was an error while handling the request.",
      });
    }
  };
}
