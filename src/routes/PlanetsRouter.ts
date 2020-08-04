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
import ApiException from "../exceptions/ApiException";
import UnauthorizedException from "../exceptions/UnauthorizedException";

import Event from "../units/Event";

@Route("planets")
@Tags("Planets")
@provide(PlanetsRouter)
export class PlanetsRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IPlanetService) private planetService: IPlanetService;

  @Get("/planetList")
  @Security("jwt")
  public async getAllPlanets(
    @Request() headers,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Planet[]>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Planet[]> {
    try {
      return await this.planetService.getAllPlanetsOfUser(headers.user.userID);
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

  @Get("/planetList/{userID}")
  @Security("jwt")
  public async getAllPlanetsOfUser(
    userID: number,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Planet[]>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Planet[]> {
    try {
      return await this.planetService.getAllPlanetsOfOtherUser(userID);
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
      return await this.planetService.getMovementOnPlanet(headers.user.userID, planetID);
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
      return await this.planetService.destroyPlanet(request.planetID, headers.user.userID);
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
      const maxLength = 10;

      if (request.newName.length < minLength || request.newName.length > maxLength) {
        return badRequestResponse(
          Globals.StatusCodes.BAD_REQUEST,
          new FailureResponse(`Length of new name must be between ${minLength} and ${maxLength}`),
        );
      }

      return await this.planetService.renamePlanet(request, headers.user.userID);
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
      return await this.planetService.getPlanet(planetID, headers.user.userID);
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
