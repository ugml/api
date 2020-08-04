import { Globals } from "../common/Globals";
import ILogger from "../interfaces/ILogger";
import Config from "../common/Config";
import { Controller, Get, Res, Route, Tags, TsoaResponse } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";
import FailureResponse from "../entities/responses/FailureResponse";

import IGameConfig, { IUnits } from "../interfaces/IGameConfig";

@Route("config")
@Tags("Configuration")
@provide(ConfigRouter)
export class ConfigRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @Get("/game")
  public getGameConfig(
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, IGameConfig>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<IGameConfig> {
    try {
      return successResponse(Globals.StatusCodes.SUCCESS, Config.getGameConfig());
    } catch (error) {
      this.logger.error(error, error.stack);

      return serverErrorResponse(
        Globals.StatusCodes.SERVER_ERROR,
        new FailureResponse("There was an error while handling the request."),
      );
    }
  }

  @Get("/units")
  public getUnitsConfig(
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, IUnits>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<IUnits> {
    try {
      return successResponse(Globals.StatusCodes.SUCCESS, Config.getGameConfig().units);
    } catch (error) {
      this.logger.error(error, error.stack);

      return serverErrorResponse(
        Globals.StatusCodes.SERVER_ERROR,
        new FailureResponse("There was an error while handling the request."),
      );
    }
  }
}
