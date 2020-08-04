import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";

import IBuildingService from "../interfaces/services/IBuildingService";
import IPlanetService from "../interfaces/services/IPlanetService";
import IShipService from "../interfaces/services/IShipService";
import Planet from "../units/Planet";
import ILogger from "../interfaces/ILogger";
import { Body, Controller, Get, Post, Request, Res, Route, Security, Tags, TsoaResponse } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";

import BuildShipsRequest from "../entities/requests/BuildShipsRequest";
import FailureResponse from "../entities/responses/FailureResponse";
import ApiException from "../exceptions/ApiException";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import Ships from "../units/Ships";

@Route("ships")
@Tags("Ships")
@provide(ShipsRouter)
export class ShipsRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IBuildingService) private buildingService: IBuildingService;
  @inject(TYPES.IPlanetService) private planetService: IPlanetService;
  @inject(TYPES.IShipService) private shipService: IShipService;

  @Get("/{planetID}")
  @Security("jwt")
  public async getAllShipsOnPlanet(
    @Request() request,
    planetID: number,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Ships>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Ships> {
    try {
      return await this.shipService.getShips(request.user.userID, planetID);
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
  public async buildShips(
    @Request() headers,
    @Body() request: BuildShipsRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Planet>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Planet> {
    try {
      if (!InputValidator.isValidBuildOrder(request.buildOrder, Globals.UnitType.SHIP)) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse("Invalid parameter"));
      }

      return await this.shipService.processBuildOrder(request, headers.user.userID);
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
