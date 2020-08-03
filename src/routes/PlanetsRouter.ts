import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";

import IPlanetService from "../interfaces/services/IPlanetService";
import Planet from "../units/Planet";
import ILogger from "../interfaces/ILogger";
import { Body, Controller, Get, Post, Request, Route, Security, Tags } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";

import DestroyPlanetRequest from "../entities/requests/DestroyPlanetRequest";
import RenamePlanetRequest from "../entities/requests/RenamePlanetRequest";
import FailureResponse from "../entities/responses/FailureResponse";

@Route("planets")
@Tags("Planets")
@provide(PlanetsRouter)
export class PlanetsRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IPlanetService) private planetService: IPlanetService;

  @Get("/planetList")
  @Security("jwt")
  public async getAllPlanets(@Request() headers) {
    try {
      return await this.planetService.getAllPlanetsOfUser(headers.user.userID, true);
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }

  @Get("/planetList/{userID}")
  @Security("jwt")
  public async getAllPlanetsOfUser(userID: number) {
    try {
      return await this.planetService.getAllPlanetsOfUser(userID);
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SUCCESS);

      return new FailureResponse("There was an error while handling the request.");
    }
  }

  @Get("/movement/{planetID}")
  @Security("jwt")
  public async getMovement(@Request() headers, planetID: number) {
    try {
      return await this.planetService.getMovementOnPlanet(headers.user.userID, planetID);
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);
      return new FailureResponse("There was an error while handling the request.");
    }
  }

  @Post("/destroy")
  @Security("jwt")
  public async destroyPlanet(@Request() headers, @Body() request: DestroyPlanetRequest) {
    try {
      const planetList = await this.planetService.getAllPlanetsOfUser(headers.user.userID);

      if (planetList.length === 1) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return new FailureResponse("The last planet cannot be destroyed");
      }

      // TODO: if the deleted planet was the current planet -> set another one as current planet
      return await this.planetService.deletePlanet(headers.user.userID, request.planetID);
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }

  @Post("/rename")
  @Security("jwt")
  public async renamePlanet(@Request() headers, @Body() request: RenamePlanetRequest) {
    try {
      const newName: string = InputValidator.sanitizeString(request.newName);

      // TODO: put into config
      const minLength = 4;
      const maxLength = 10;

      if (newName.length < minLength || newName.length > maxLength) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return {
          error: `Length of new name must be between ${minLength} and ${maxLength}`,
        };
      }

      const planet: Planet = await this.planetService.getPlanet(headers.user.userID, request.planetID, true);

      planet.name = newName;

      await this.planetService.updatePlanet(planet);

      return planet;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }

  @Get("/{planetID}")
  @Security("jwt")
  public async getPlanetByID(@Request() headers, planetID: number) {
    try {
      const planet: Planet = await this.planetService.getPlanet(headers.user.userID, planetID);

      if (planet.ownerID === headers.user.userID) {
        return await this.planetService.getPlanet(headers.user.userID, planetID, true);
      }

      return planet;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }
}
