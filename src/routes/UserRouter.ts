import { Globals } from "../common/Globals";
import User from "../units/User";
import InputValidator from "../common/InputValidator";

import FailureResponse from "../entities/responses/FailureResponse";

import ILogger from "../interfaces/ILogger";
import IBuildingService from "../interfaces/services/IBuildingService";
import IDefenseService from "../interfaces/services/IDefenseService";
import IGalaxyService from "../interfaces/services/IGalaxyService";
import IPlanetService from "../interfaces/services/IPlanetService";
import IShipService from "../interfaces/services/IShipService";
import ITechService from "../interfaces/services/ITechService";
import IUserService from "../interfaces/services/IUserService";

import CreateUserRequest from "../entities/requests/CreateUserRequest";
import UpdateUserRequest from "../entities/requests/UpdateUserRequest";
import SetCurrentPlanetRequest from "../entities/requests/SetCurrentPlanetRequest";

import { inject } from "inversify";
import TYPES from "../ioc/types";
import { provide } from "inversify-binding-decorators";

import { Route, Get, Tags, Controller, Security, Request, Post, Body, Res, TsoaResponse } from "tsoa";
import ApiException from "../exceptions/ApiException";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import AuthResponse from "../entities/responses/AuthResponse";

/**
 * Defines routes for user-data
 */
@Route("user")
@Tags("UserData")
// eslint-disable-next-line @typescript-eslint/no-use-before-define
@provide(UserRouter)
export class UserRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IUserService) private userService: IUserService;
  @inject(TYPES.IGalaxyService) private galaxyService: IGalaxyService;
  @inject(TYPES.IPlanetService) private planetService: IPlanetService;
  @inject(TYPES.IBuildingService) private buildingService: IBuildingService;
  @inject(TYPES.IDefenseService) private defenseService: IDefenseService;
  @inject(TYPES.IShipService) private shipService: IShipService;
  @inject(TYPES.ITechService) private techService: ITechService;

  @Get("/")
  @Security("jwt")
  public async getUserSelf(
    @Request() request,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, User>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<User> {
    try {
      return await this.userService.getAuthenticatedUser(request.user.userID);
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

  @Get("/{userID}")
  @Security("jwt")
  public async getUserByID(
    userID: number,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, User>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<User> {
    try {
      return await this.userService.getOtherUser(userID);
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

  @Post("/create")
  public async createUser(
    @Body() request: CreateUserRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, AuthResponse>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<AuthResponse> {
    try {
      if (
        !InputValidator.isSet(request.username) ||
        !InputValidator.isSet(request.password) ||
        !InputValidator.isSet(request.email)
      ) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse("Invalid parameter"));
      }

      request.username = InputValidator.sanitizeString(request.username);
      request.password = InputValidator.sanitizeString(request.password);
      request.email = InputValidator.sanitizeString(request.email);

      return await this.userService.createUser(request);
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

  /**
   * Updates a user
   */
  @Post("/update")
  @Security("jwt")
  public async updateUser(
    @Request() headers,
    @Request() request,
    @Body() requestModel: UpdateUserRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, User>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<User> {
    try {
      if (!requestModel.isValid()) {
        return badRequestResponse(
          Globals.StatusCodes.BAD_REQUEST,
          new FailureResponse("Invalid parameters were passed"),
        );
      }

      return await this.userService.updateUser(request, headers.user.userID);
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

  /**
   * Sets the current planet for a user
   */
  @Post("/currentplanet/set")
  @Security("jwt")
  public async setCurrentPlanet(
    @Request() headers,
    @Request() request,
    @Body() model: SetCurrentPlanetRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, User>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<User> {
    try {
      return await this.userService.setCurrentPlanet(request, headers.user.userID);
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
