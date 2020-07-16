import { Router } from "express";
import { Globals } from "../common/Globals";
import Encryption from "../common/Encryption";
import InputValidator from "../common/InputValidator";
import JwtHelper from "../common/JwtHelper";

import IUserService from "../interfaces/IUserService";
import ILogger from "../interfaces/ILogger";

import { Controller, Route, Post, Body } from "tsoa";

export interface AuthResponse {
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
@Route("auth")
export class AuthRouter extends Controller {
  public router: Router = Router();

  private userService: IUserService;
  private logger: ILogger;

  @Post()
  public async authenticate(@Body() req: AuthRequest): Promise<AuthResponse | BadRequest> {
    if (!InputValidator.isSet(req.email) || !InputValidator.isSet(req.password)) {
      this.setStatus(Globals.Statuscode.BAD_REQUEST);
      return {
        error: "Invalid parameter",
      };
    }

    const email: string = InputValidator.sanitizeString(req.email);

    const password: string = InputValidator.sanitizeString(req.password);

    const data = await this.userService.getUserForAuthentication(email);

    if (!InputValidator.isSet(data)) {
      this.setStatus(Globals.Statuscode.NOT_AUTHORIZED);
      return {
        error: "Authentication failed",
      };
    }

    const isValidPassword = await Encryption.compare(password, data.password);

    if (!isValidPassword) {
      this.setStatus(Globals.Statuscode.NOT_AUTHORIZED);
      return {
        error: "Authentication failed",
      };
    }

    return {
      token: JwtHelper.generateToken(data.userID),
    };
  }
}
