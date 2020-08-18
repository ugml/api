import InputValidator from "../common/InputValidator";

import IUserService from "../interfaces/services/IUserService";

import { Route, Post, Body, Tags, Controller, Res, TsoaResponse } from "tsoa";

import { inject } from "inversify";
import TYPES from "../ioc/types";
import { provide } from "inversify-binding-decorators";
import { Globals } from "../common/Globals";
import AuthSuccessResponse from "../entities/responses/AuthSuccessResponse";
import FailureResponse from "../entities/responses/FailureResponse";
import AuthRequest from "../entities/requests/AuthRequest";
import IAuthService from "../interfaces/services/IAuthService";
import IErrorHandler from "../interfaces/IErrorHandler";

@Route("login")
@Tags("Authentication")
// eslint-disable-next-line @typescript-eslint/no-use-before-define
@provide(AuthRouter)
export class AuthRouter extends Controller {
  @inject(TYPES.IErrorHandler) private errorHandler: IErrorHandler;

  @inject(TYPES.IUserService) private userService: IUserService;
  @inject(TYPES.IAuthService) private authService: IAuthService;

  @Post("/")
  public async login(
    @Body() req: AuthRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, AuthSuccessResponse>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<AuthSuccessResponse> {
    try {
      const email: string = InputValidator.sanitizeString(req.email);
      const password: string = InputValidator.sanitizeString(req.password);

      const token = await this.authService.authenticateUser(email, password);

      return successResponse(Globals.StatusCodes.SUCCESS, {
        token: token,
      });
    } catch (error) {
      return this.errorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }
}
