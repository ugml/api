import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";

import IGalaxyService from "../interfaces/services/IGalaxyService";
import ILogger from "../interfaces/ILogger";
import {Controller, Get, Route, Security, SuccessResponse, Tags} from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";

@Tags("Galaxy")
@Route("galaxy")
@provide(GalaxyRouter)
export class GalaxyRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IGalaxyService) private galaxyService: IGalaxyService;

  @Security("jwt")
  @Get("/{posGalaxy}/{posSystem}")
  public async getGalaxyInformation(posGalaxy: number, posSystem: number) {
    try {
      if (!InputValidator.isValidPosition(posGalaxy, posSystem)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);
        return {
          error: "Invalid parameter",
        };
      }

      return await this.galaxyService.getGalaxyInfo(posGalaxy, posSystem);
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return {
        error: "There was an error while handling the request.",
      };
    }
  }
}
