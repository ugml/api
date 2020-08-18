import { Globals } from "../common/Globals";

import Config from "../common/Config";
import { Controller, Get, Res, Route, Tags, TsoaResponse } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";
import FailureResponse from "../entities/responses/FailureResponse";

import IGameConfig, { IUnits } from "../interfaces/IGameConfig";
import IErrorHandler from "../interfaces/IErrorHandler";

@Route("config")
@Tags("Configuration")
// eslint-disable-next-line @typescript-eslint/no-use-before-define
@provide(ConfigRouter)
export class ConfigRouter extends Controller {
  @inject(TYPES.IErrorHandler) private errorHandler: IErrorHandler;

  @Get("/game")
  public getGameConfig(
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, IGameConfig>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<IGameConfig> {
    try {
      return successResponse(Globals.StatusCodes.SUCCESS, Config.getGameConfig());
    } catch (error) {
      return this.errorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }

  @Get("/units")
  public getUnitsConfig(
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, IUnits>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<IUnits> {
    try {
      return successResponse(Globals.StatusCodes.SUCCESS, Config.getGameConfig().units);
    } catch (error) {
      return this.errorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }
}
