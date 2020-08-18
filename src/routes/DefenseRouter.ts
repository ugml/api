import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";

import IBuildingService from "../interfaces/services/IBuildingService";

import IDefenseService from "../interfaces/services/IDefenseService";
import IPlanetService from "../interfaces/services/IPlanetService";

import Defenses from "../units/Defenses";

import { Body, Controller, Get, Post, Request, Res, Route, Security, Tags, TsoaResponse } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";

import BuildDefenseRequest from "../entities/requests/BuildDefenseRequest";
import FailureResponse from "../entities/responses/FailureResponse";

import Planet from "../units/Planet";

import IErrorHandler from "../interfaces/IErrorHandler";

@Route("defenses")
@Tags("Defenses")
// eslint-disable-next-line @typescript-eslint/no-use-before-define
@provide(DefenseRouter)
export class DefenseRouter extends Controller {
  @inject(TYPES.IErrorHandler) private errorHandler: IErrorHandler;

  @inject(TYPES.IBuildingService) private buildingService: IBuildingService;
  @inject(TYPES.IPlanetService) private planetService: IPlanetService;
  @inject(TYPES.IDefenseService) private defenseService: IDefenseService;

  @Get("/{planetID}")
  @Security("jwt")
  public async getAllDefensesOnPlanet(
    @Request() headers,
    planetID: number,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Defenses>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Defenses> {
    try {
      return await this.defenseService.getAll(headers.user.userID, planetID);
    } catch (error) {
      return this.errorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }

  @Post("/build")
  @Security("jwt")
  public async buildDefense(
    @Request() headers,
    @Body() request: BuildDefenseRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Planet>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Planet> {
    try {
      if (!InputValidator.isValidBuildOrder(request.buildOrder, Globals.UnitType.DEFENSE)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse("Invalid parameter"));
      }

      return await this.defenseService.processBuildOrder(request, headers.user.userID);
    } catch (error) {
      return this.errorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }
}
