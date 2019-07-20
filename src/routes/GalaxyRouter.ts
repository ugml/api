import { NextFunction, Response, Router as newRouter, IRouter } from "express";
import { Config } from "../common/Config";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";

import { Logger } from "../common/Logger";

export default class GalaxyRouter {
  public router: IRouter<{}> = newRouter();

  private galaxyService;

  public constructor(container) {
    this.galaxyService = container.galaxyService;
    this.router.get("/:galaxy/:system", this.getGalaxyInformation);
  }

  /**
   * GET planet by ID
   */
  public getGalaxyInformation = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      // validate parameters
      if (
        !InputValidator.isSet(request.params.galaxy) ||
        !InputValidator.isValidInt(request.params.galaxy) ||
        !InputValidator.isSet(request.params.system) ||
        !InputValidator.isValidInt(request.params.system)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const galaxy = parseInt(request.params.galaxy, 10);
      const system = parseInt(request.params.system, 10);

      if (galaxy < 1 || galaxy > Config.Get.pos_galaxy_max || system < 1 || system > Config.Get.pos_system_max) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const galaxyData = await this.galaxyService.getGalaxyInfo(galaxy, system);

      // return the result
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
