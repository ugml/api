import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";

import IGalaxyService from "../interfaces/services/IGalaxyService";
import ILogger from "../interfaces/ILogger";
import { Controller, Get, Route, Security, Tags } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";
import FailureResponse from "../entities/responses/FailureResponse";

@Route("galaxy")
@Tags("Galaxy")
@provide(GalaxyRouter)
export class GalaxyRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;
  @inject(TYPES.IGalaxyService) private galaxyService: IGalaxyService;

  @Get("/{posGalaxy}/{posSystem}")
  @Security("jwt")
  public async getGalaxyInformation(posGalaxy: number, posSystem: number) {
    try {
      if (!InputValidator.isValidPosition(posGalaxy, posSystem)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);
        return new FailureResponse("Invalid parameter");
      }

      return await this.galaxyService.getGalaxyInfo(posGalaxy, posSystem);
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }
}
