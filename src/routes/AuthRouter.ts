import Encryption from "../common/Encryption";
import InputValidator from "../common/InputValidator";
import JwtHelper from "../common/JwtHelper";

import IUserService from "../interfaces/IUserService";
import ILogger from "../interfaces/ILogger";

import { Route, Post, Body, Tags, SuccessResponse, Response, Controller, Example } from "tsoa";

import { inject } from "inversify";
import TYPES from "../ioc/types";
import { provide } from "inversify-binding-decorators";
import { Globals } from "../common/Globals";

export class AuthResponse {
  token: string;
}

export interface BadRequest {
  error: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

/**
 * Defines routes for authentication
 */
@Tags("Authentication")
@Route("login")
@provide(AuthRouter)
export class AuthRouter extends Controller {
  @inject(TYPES.IUserService) private userService: IUserService;
  @inject(TYPES.ILogger) private logger: ILogger;

  @Post()
  @SuccessResponse(Globals.StatusCodes.SUCCESS)
  @Example<AuthResponse>({ token: "someToken" })
  @Response<BadRequest>(Globals.StatusCodes.BAD_REQUEST, "", { error: "Invalid parameter" })
  @Response<BadRequest>(Globals.StatusCodes.NOT_AUTHORIZED, "", { error: "Authentication failed" })
  public async authenticate(@Body() req: AuthRequest): Promise<AuthResponse | BadRequest> {
    if (!InputValidator.isSet(req.email) || !InputValidator.isSet(req.password)) {
      this.setStatus(Globals.StatusCodes.BAD_REQUEST);
      return {
        error: "Invalid parameter",
      };
    }

    const email: string = InputValidator.sanitizeString(req.email);

    const password: string = InputValidator.sanitizeString(req.password);

    const data = await this.userService.getUserForAuthentication(email);

    if (!InputValidator.isSet(data)) {
      this.setStatus(Globals.StatusCodes.NOT_AUTHORIZED);
      return {
        error: "Authentication failed",
      };
    }

    const isValidPassword = await Encryption.compare(password, data.password);

    if (!isValidPassword) {
      this.setStatus(Globals.StatusCodes.NOT_AUTHORIZED);
      return {
        error: "Authentication failed",
      };
    }

    return {
      token: JwtHelper.generateToken(data.userID),
    };
  }
}
