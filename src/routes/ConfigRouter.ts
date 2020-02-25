import { NextFunction, Request, Response, Router } from "express";
import { Globals } from "../common/Globals";
import Logger from "../common/Logger";

/**
 * Defines routes to get the config-files
 */
export default class ConfigRouter {
  public router: Router;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.router.get("/game", this.getGameConfig);
    this.router.get("/units", this.getUnitsConfig);
  }

  /**
   * Returns the current game-configuration
   * @param req
   * @param response
   * @param next
   */
  public getGameConfig(req: Request, response: Response, next: NextFunction) {
    try {
      const data = require("../config/game.json");

      return response.status(Globals.Statuscode.SUCCESS).json(data);
    } catch (err) {
      Logger.error(err);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        error: "There was an error while handling the request.",
      });
    }
  }

  /**
   * Returns the current unit-configuration
   * @param req
   * @param response
   * @param next
   */
  public getUnitsConfig(req: Request, response: Response, next: NextFunction) {
    try {
      const data = require("../config/units.json");

      return response.status(Globals.Statuscode.SUCCESS).json(data);
    } catch (err) {
      Logger.error(err);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        error: "There was an error while handling the request.",
      });
    }
  }
}
