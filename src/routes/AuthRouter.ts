import Encryption from "../common/Encryption";
import InputValidator from "../common/InputValidator";
import JwtHelper from "../common/JwtHelper";

import IUserService from "../interfaces/services/IUserService";
import ILogger from "../interfaces/ILogger";

import { Route, Post, Body, Tags, Response, Controller, Example } from "tsoa";

import { inject } from "inversify";
import TYPES from "../ioc/types";
import { provide } from "inversify-binding-decorators";
import { Globals } from "../common/Globals";
import AuthResponse from "../entities/responses/AuthResponse";
import FailureResponse from "../entities/responses/FailureResponse";
import AuthRequest from "../entities/requests/AuthRequest";

@Tags("Authentication")
@Route("login")
@provide(AuthRouter)
export class AuthRouter extends Controller {
  @inject(TYPES.IUserService) private userService: IUserService;
  @inject(TYPES.ILogger) private logger: ILogger;

  @Post()
  @Example<AuthResponse>({ token: "someToken" })
  @Response<FailureResponse>(Globals.StatusCodes.BAD_REQUEST, "", { error: "Invalid parameter" })
  @Response<FailureResponse>(Globals.StatusCodes.NOT_AUTHORIZED, "", { error: "Authentication failed" })
  public async authenticate(@Body() req: AuthRequest): Promise<AuthResponse | FailureResponse> {
    if (!InputValidator.isSet(req.email) || !InputValidator.isSet(req.password)) {
      this.setStatus(Globals.StatusCodes.BAD_REQUEST);
      return new FailureResponse("Invalid parameter");
    }

    const email: string = InputValidator.sanitizeString(req.email);

    const password: string = InputValidator.sanitizeString(req.password);

    const data = await this.userService.getUserForAuthentication(email);

    if (!InputValidator.isSet(data)) {
      this.setStatus(Globals.StatusCodes.NOT_AUTHORIZED);
      return new FailureResponse("Authentication failed");
    }

    const isValidPassword = await Encryption.compare(password, data.password);

    if (!isValidPassword) {
      this.setStatus(Globals.StatusCodes.NOT_AUTHORIZED);
      return new FailureResponse("Authentication failed");
    }

    return {
      token: JwtHelper.generateToken(data.userID),
    };
  }
}
