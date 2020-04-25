import { Request, Response, Router } from "express";
import { Globals } from "../common/Globals";
import ILogger from "../interfaces/ILogger";
import Config from "../common/Config";

/**
 * Defines routes to get the config-files
 */
export default class ConfigRouter {
  public router: Router = Router();

  private logger: ILogger;

  public constructor(logger: ILogger) {
    this.router.get("/game", this.getGameConfig);
    this.router.get("/units", this.getUnitsConfig);

    this.logger = logger;
  }

  public getGameConfig(request: Request, response: Response) {
    try {
      const data = Config.getGameConfig();

      return response.status(Globals.Statuscode.SUCCESS).json(data ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  }

  public getUnitsConfig(request: Request, response: Response) {
    try {
      const data = Config.getGameConfig();

      return response.status(Globals.Statuscode.SUCCESS).json(data.units ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  }
}
