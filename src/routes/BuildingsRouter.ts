import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import ILogger from "../interfaces/ILogger";
import IBuildingService from "../interfaces/services/IBuildingService";
import IPlanetService from "../interfaces/services/IPlanetService";
import IUserService from "../interfaces/services/IUserService";

import Planet from "../units/Planet";
import Buildings from "../units/Buildings";

import { inject } from "inversify";
import TYPES from "../ioc/types";
import { Body, Controller, Get, Post, Request, Res, Route, Security, Tags, TsoaResponse } from "tsoa";
import { provide } from "inversify-binding-decorators";

import CancelBuildingRequest from "../entities/requests/CancelBuildingRequest";
import BuildBuildingRequest from "../entities/requests/BuildBuildingRequest";
import DemolishBuildingRequest from "../entities/requests/DemolishBuildingRequest";
import FailureResponse from "../entities/responses/FailureResponse";

import ErrorHandler from "../common/ErrorHandler";

@Route("buildings")
@Tags("Buildings")
// eslint-disable-next-line @typescript-eslint/no-use-before-define
@provide(BuildingsRouter)
export class BuildingsRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IBuildingService) private buildingService: IBuildingService;
  @inject(TYPES.IPlanetService) private planetService: IPlanetService;
  @inject(TYPES.IUserService) private userService: IUserService;

  @Get("/{planetID}")
  @Security("jwt")
  public async getAllBuildingsOnPlanet(
    @Request() request,
    planetID: number,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Buildings>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Buildings> {
    try {
      return successResponse(
        Globals.StatusCodes.SUCCESS,
        await this.buildingService.getAll(planetID, request.user.userID),
      );
    } catch (error) {
      return ErrorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }

  @Post("/build")
  @Security("jwt")
  public async startBuilding(
    @Request() headers,
    @Body() request: BuildBuildingRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Planet>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Planet> {
    try {
      if (!InputValidator.isValidBuildingId(request.buildingID)) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse("Invalid parameter"));
      }

      return await this.buildingService.start(request, headers.user.userID);
    } catch (error) {
      return ErrorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }

  @Post("/cancel")
  @Security("jwt")
  public async cancelBuilding(
    @Request() headers,
    @Body() request: CancelBuildingRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Planet>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Planet> {
    try {
      return await this.buildingService.cancel(request.planetID, headers.user.userID);
    } catch (error) {
      return ErrorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }

  @Post("/demolish")
  @Security("jwt")
  public async demolishBuilding(
    @Request() headers,
    @Body() request: DemolishBuildingRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Planet>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Planet> {
    try {
      if (!InputValidator.isValidBuildingId(request.buildingID)) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse("Invalid parameter"));
      }

      return await this.buildingService.demolish(request, headers.user.userID);
    } catch (error) {
      return ErrorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }
}
