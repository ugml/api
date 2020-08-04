import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";

import IGalaxyService from "../interfaces/services/IGalaxyService";
import ILogger from "../interfaces/ILogger";
import { Controller, Get, Res, Route, Security, Tags, TsoaResponse } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";
import FailureResponse from "../entities/responses/FailureResponse";
import ApiException from "../exceptions/ApiException";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import GalaxyPositionInfo from "../units/GalaxyPositionInfo";

@Route("galaxy")
@Tags("Galaxy")
// eslint-disable-next-line @typescript-eslint/no-use-before-define
@provide(GalaxyRouter)
export class GalaxyRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;
  @inject(TYPES.IGalaxyService) private galaxyService: IGalaxyService;

  @Get("/{posGalaxy}/{posSystem}")
  @Security("jwt")
  public async getGalaxyInformation(
    posGalaxy: number,
    posSystem: number,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, GalaxyPositionInfo[]>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<GalaxyPositionInfo[]> {
    try {
      if (!InputValidator.isValidPosition(posGalaxy, posSystem)) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse("Invalid parameter"));
      }

      return await this.galaxyService.getGalaxyInfo(posGalaxy, posSystem);
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
