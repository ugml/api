import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";

import IPlanetService from "../interfaces/services/IPlanetService";
import Planet from "../units/Planet";
import ILogger from "../interfaces/ILogger";
import { Body, Controller, Get, Post, Request, Res, Route, Security, Tags, TsoaResponse } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";

import DestroyPlanetRequest from "../entities/requests/DestroyPlanetRequest";
import RenamePlanetRequest from "../entities/requests/RenamePlanetRequest";
import FailureResponse from "../entities/responses/FailureResponse";

import Event from "../units/Event";
import ErrorHandler from "../common/ErrorHandler";

@Route("planets")
@Tags("Planets")
// eslint-disable-next-line @typescript-eslint/no-use-before-define
@provide(PlanetsRouter)
export class PlanetsRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IPlanetService) private planetService: IPlanetService;

  @Get("/movement/{planetID}")
  @Security("jwt")
  public async getMovement(
    @Request() headers,
    planetID: number,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Event[]>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Event[]> {
    try {
      return successResponse(
        Globals.StatusCodes.SUCCESS,
        await this.planetService.getMovement(headers.user.userID, planetID),
      );
    } catch (error) {
      return ErrorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }

  @Post("/destroy")
  @Security("jwt")
  public async destroyPlanet(
    @Request() headers,
    @Body() request: DestroyPlanetRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, void>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<void> {
    try {
      return await this.planetService.destroy(request.planetID, headers.user.userID);
    } catch (error) {
      return ErrorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }

  @Post("/rename")
  @Security("jwt")
  public async renamePlanet(
    @Request() headers,
    @Body() request: RenamePlanetRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Planet>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Planet> {
    try {
      request.newName = InputValidator.sanitizeString(request.newName);

      // TODO: put into config
      const minLength = 4;
      const maxLength = 32;

      if (request.newName.length < minLength || request.newName.length > maxLength) {
        return badRequestResponse(
          Globals.StatusCodes.BAD_REQUEST,
          new FailureResponse(`Length of new name must be between ${minLength} and ${maxLength}`),
        );
      }

      return await this.planetService.rename(request, headers.user.userID);
    } catch (error) {
      return ErrorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }

  @Get("/{planetID}")
  @Security("jwt")
  public async getPlanetByID(
    @Request() headers,
    planetID: number,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Planet>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Planet> {
    try {
      return await this.planetService.getById(planetID, headers.user.userID);
    } catch (error) {
      return ErrorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }
}
