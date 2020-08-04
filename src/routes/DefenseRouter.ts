import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";

import IBuildingService from "../interfaces/services/IBuildingService";

import IDefenseService from "../interfaces/services/IDefenseService";
import IPlanetService from "../interfaces/services/IPlanetService";

import Defenses from "../units/Defenses";

import ILogger from "../interfaces/ILogger";
import { Body, Controller, Get, Post, Request, Res, Route, Security, Tags, TsoaResponse } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";

import BuildDefenseRequest from "../entities/requests/BuildDefenseRequest";
import FailureResponse from "../entities/responses/FailureResponse";
import ApiException from "../exceptions/ApiException";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import Planet from "../units/Planet";

@Route("defenses")
@Tags("Defenses")
@provide(DefenseRouter)
export class DefenseRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

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
      return await this.defenseService.getDefenses(headers.user.userID, planetID);
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
