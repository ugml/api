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
    this.router.get("/:pos_galaxy/:pos_system", this.getGalaxyInformation);
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
        !InputValidator.isSet(request.params.pos_galaxy) ||
        !InputValidator.isValidInt(request.params.pos_galaxy) ||
        !InputValidator.isSet(request.params.pos_system) ||
        !InputValidator.isValidInt(request.params.pos_system)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const pos_galaxy = parseInt(request.params.pos_galaxy, 10);
      const pos_system = parseInt(request.params.pos_system, 10);

      if (!InputValidator.isValidPosition(pos_galaxy, pos_system)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const galaxyData = await this.galaxyService.getGalaxyInfo(pos_galaxy, pos_system);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: galaxyData,
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  };
}
