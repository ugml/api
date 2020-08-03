import { Globals } from "../common/Globals";
import ILogger from "../interfaces/ILogger";
import Config from "../common/Config";
import { Controller, Get, Route, Tags } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";
import FailureResponse from "../entities/responses/FailureResponse";

@Route("config")
@Tags("Configuration")
@provide(ConfigRouter)
export class ConfigRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @Get("/game")
  public getGameConfig() {
    try {
      return Config.getGameConfig();
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }

  @Get("/units")
  public getUnitsConfig() {
    try {
      return Config.getGameConfig().units;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }
}
