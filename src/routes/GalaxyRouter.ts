import "reflect-metadata";
import { NextFunction, Response, Router } from "express";
import { inject } from "inversify";
import { Config } from "../common/Config";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";

import { Logger } from "../common/Logger";
import { TYPES } from "../types";

export class GalaxyRouter {
  public router: Router;

  @inject(TYPES.IGalaxyService) private galaxyService;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET planet by ID
   */
  public async getGalaxyInformation(request: IAuthorizedRequest, response: Response, next: NextFunction) {
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
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  public init() {
    this.router.get("/:galaxy/:system", this.getGalaxyInformation);
  }
}

const galaxyRouter = new GalaxyRouter();
galaxyRouter.init();

export default galaxyRouter.router;
