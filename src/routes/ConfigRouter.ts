import { Globals } from "../common/Globals";
import ILogger from "../interfaces/ILogger";
import Config from "../common/Config";
import {Controller, Get, Route, SuccessResponse, Tags} from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";

@Tags("Configuration")
@Route("config")
@provide(ConfigRouter)
export class ConfigRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @Get("/game")
  @SuccessResponse(Globals.StatusCodes.SUCCESS)
  public getGameConfig() {
    try {
      this.setStatus(Globals.StatusCodes.SUCCESS);

      return Config.getGameConfig();
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return {
        error: "There was an error while handling the request.",
      };
    }
  }

  @Get("/units")
  @SuccessResponse(Globals.StatusCodes.SUCCESS)
  public getUnitsConfig() {
    try {
      this.setStatus(Globals.StatusCodes.SUCCESS);

      return Config.getGameConfig().units;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return {
        error: "There was an error while handling the request.",
      };
    }
  }
}
