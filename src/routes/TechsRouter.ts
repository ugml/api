import { Globals } from "../common/Globals";

import IBuildingService from "../interfaces/services/IBuildingService";
import IPlanetService from "../interfaces/services/IPlanetService";
import ITechService from "../interfaces/services/ITechService";
import Planet from "../units/Planet";
import Techs from "../units/Techs";

import IUserService from "../interfaces/services/IUserService";
import ILogger from "../interfaces/ILogger";
import { Body, Controller, Get, Post, Request, Res, Route, Security, Tags, TsoaResponse } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";

import CancelTechRequest from "../entities/requests/CancelTechRequest";
import BuildTechRequest from "../entities/requests/BuildTechRequest";
import FailureResponse from "../entities/responses/FailureResponse";
import ApiException from "../exceptions/ApiException";
import UnauthorizedException from "../exceptions/UnauthorizedException";

@Route("technologies")
@Tags("Technologies")
// eslint-disable-next-line @typescript-eslint/no-use-before-define
@provide(TechsRouter)
export class TechsRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IUserService) private userService: IUserService;
  @inject(TYPES.IPlanetService) private planetService: IPlanetService;
  @inject(TYPES.IBuildingService) private buildingService: IBuildingService;
  @inject(TYPES.ITechService) private techService: ITechService;

  @Get("/")
  @Security("jwt")
  public async getTechs(
    @Request() headers,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Techs>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Techs> {
    try {
      return await this.techService.getTechs(headers.user.userID);
    } catch (error) {
      if (error instanceof ApiException) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse(error.message));
      }

      if (error instanceof UnauthorizedException) {
        return unauthorizedResponse(Globals.StatusCodes.NOT_AUTHORIZED, new FailureResponse(error.message));
      }

      this.logger.error(error, error.stack);

      return serverErrorResponse(
        Globals.StatusCodes.SERVER_ERROR,
        new FailureResponse("There was an error while handling the request."),
      );
    }
  }

  @Post("/build")
  @Security("jwt")
  public async buildTech(
    @Request() headers,
    @Body() request: BuildTechRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Planet>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Planet> {
    try {
      if (request.techID < Globals.MIN_TECHNOLOGY_ID || request.techID > Globals.MAX_TECHNOLOGY_ID) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse("Invalid parameter"));
      }

      return await this.techService.buildTech(request, headers.user.userID);
    } catch (error) {
      if (error instanceof ApiException) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse(error.message));
      }

      if (error instanceof UnauthorizedException) {
        return unauthorizedResponse(Globals.StatusCodes.NOT_AUTHORIZED, new FailureResponse(error.message));
      }

      this.logger.error(error, error.stack);

      return serverErrorResponse(
        Globals.StatusCodes.SERVER_ERROR,
        new FailureResponse("There was an error while handling the request."),
      );
    }
  }

  @Post("/cancel")
  @Security("jwt")
  public async cancelTech(
    @Request() headers,
    @Body() request: CancelTechRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Planet>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Planet> {
    try {
      return await this.techService.cancelTech(request, headers.user.userID);
    } catch (error) {
      if (error instanceof ApiException) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse(error.message));
      }

      if (error instanceof UnauthorizedException) {
        return unauthorizedResponse(Globals.StatusCodes.NOT_AUTHORIZED, new FailureResponse(error.message));
      }

      this.logger.error(error, error.stack);

      return serverErrorResponse(
        Globals.StatusCodes.SERVER_ERROR,
        new FailureResponse("There was an error while handling the request."),
      );
    }
  }
}
