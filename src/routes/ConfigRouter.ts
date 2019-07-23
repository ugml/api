import { NextFunction, Request, Response, Router } from "express";
import { Globals } from "../common/Globals";

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
    const data = require("../config/game.json");

    return response.status(Globals.Statuscode.SUCCESS).json(data);
  }

  /**
   * Returns the current unit-configuration
   * @param req
   * @param response
   * @param next
   */
  public getUnitsConfig(req: Request, response: Response, next: NextFunction) {
    const data = require("../config/units.json");

    return response.status(Globals.Statuscode.SUCCESS).json(data);
  }
}
