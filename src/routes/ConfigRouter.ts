import { Request, Response, Router } from "express";
import { Globals } from "../common/Globals";
import ILogger from "../interfaces/ILogger";

/**
 * Defines routes to get the config-files
 */
export default class ConfigRouter {
  public router: Router = Router();

  private logger: ILogger;

  /**
   * Initialize the Router
   * @param logger Instance of an ILogger-object
   */
  public constructor(logger: ILogger) {
    this.router.get("/game", this.getGameConfig);
    this.router.get("/units", this.getUnitsConfig);

    this.logger = logger;
  }

  /**
   * Returns the current game-configuration
   * @param req
   * @param response
   * @param next
   */
  public getGameConfig(req: Request, response: Response) {
    try {
      const data = require("../config/game.json");

      return response.status(Globals.Statuscode.SUCCESS).json(data ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
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
  public getUnitsConfig(req: Request, response: Response) {
    try {
      const data = require("../config/game.json");

      return response.status(Globals.Statuscode.SUCCESS).json(data.units ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  }
}
