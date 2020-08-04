import InputValidator from "../common/InputValidator";

import IUserService from "../interfaces/services/IUserService";
import ILogger from "../interfaces/ILogger";

import { Route, Post, Body, Tags, Controller, Res, TsoaResponse } from "tsoa";

import { inject } from "inversify";
import TYPES from "../ioc/types";
import { provide } from "inversify-binding-decorators";
import { Globals } from "../common/Globals";
import AuthResponse from "../entities/responses/AuthResponse";
import FailureResponse from "../entities/responses/FailureResponse";
import AuthRequest from "../entities/requests/AuthRequest";
import IAuthService from "../interfaces/services/IAuthService";

@Route("login")
@Tags("Authentication")
@provide(AuthRouter)
export class AuthRouter extends Controller {
  @inject(TYPES.IUserService) private userService: IUserService;
  @inject(TYPES.IAuthService) private authService: IAuthService;
  @inject(TYPES.ILogger) private logger: ILogger;

  @Post("/")
  public async authenticate(
    @Body() req: AuthRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, AuthResponse>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<AuthResponse> {
    try {
      if (!InputValidator.isSet(req.email) || !InputValidator.isSet(req.password)) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse("Invalid parameter"));
      }

      const email: string = InputValidator.sanitizeString(req.email);
      const password: string = InputValidator.sanitizeString(req.password);

      const token = await this.authService.authenticateUser(email, password);

      if (!InputValidator.isSet(token)) {
        return unauthorizedResponse(Globals.StatusCodes.NOT_AUTHORIZED, new FailureResponse("Authentication failed"));
      }

      return {
        token: token,
      };
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return serverErrorResponse(
        Globals.StatusCodes.SERVER_ERROR,
        new FailureResponse("There was an error while handling the request."),
      );
    }
  }
}
