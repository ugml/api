import Calculations from "../common/Calculations";
import Config from "../common/Config";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";

import IBuildingService from "../interfaces/services/IBuildingService";
import IUnitCosts from "../interfaces/IUnitCosts";
import IPlanetService from "../interfaces/services/IPlanetService";
import ITechService from "../interfaces/services/ITechService";
import Buildings from "../units/Buildings";
import Planet from "../units/Planet";
import Techs from "../units/Techs";
import User from "../units/User";
import IUserService from "../interfaces/services/IUserService";
import ILogger from "../interfaces/ILogger";
import { Body, Controller, Get, Post, Request, Route, Security, Tags } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";

import CancelTechRequest from "../entities/requests/CancelTechRequest";
import BuildTechRequest from "../entities/requests/BuildTechRequest";
import FailureResponse from "../entities/responses/FailureResponse";

@Route("technologies")
@Tags("Technologies")
@provide(TechsRouter)
export class TechsRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IUserService) private userService: IUserService;
  @inject(TYPES.IPlanetService) private planetService: IPlanetService;
  @inject(TYPES.IBuildingService) private buildingService: IBuildingService;
  @inject(TYPES.ITechService) private techService: ITechService;

  @Get("/")
  @Security("jwt")
  public async getTechs(@Request() headers) {
    try {
      return await this.techService.getTechs(headers.user.userID);
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }

  @Post("/cancel")
  @Security("jwt")
  public async cancelTech(@Request() headers, @Body() request: CancelTechRequest) {
    try {
      const planet: Planet = await this.planetService.getPlanet(headers.user.userID, request.planetID, true);
      const techs: Techs = await this.techService.getTechs(headers.user.userID);
      const user: User = await this.userService.getAuthenticatedUser(headers.user.userID);

      // player does not own the planet
      if (!InputValidator.isSet(planet)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return new FailureResponse("Invalid parameter");
      }

      // 1. check if there is already a build-job on the planet
      if (user.bTechID === 0 && user.bTechEndTime === 0) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);
        return {
          error: "Planet has no build-job",
        };
      }

      const techKey = Globals.UnitNames[user.bTechID];

      const currentLevel = techs[techKey];

      const cost: IUnitCosts = Calculations.getCosts(user.bTechID, currentLevel);

      planet.metal += cost.metal;
      planet.crystal += cost.crystal;
      planet.deuterium += cost.deuterium;
      user.bTechID = 0;
      user.bTechEndTime = 0;

      await this.planetService.updatePlanet(planet);
      await this.userService.updateUserData(user);

      return planet;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }

  @Post("/build")
  @Security("jwt")
  public async buildTech(@Request() headers, @Body() request: BuildTechRequest) {
    try {
      if (request.techID < Globals.MIN_TECHNOLOGY_ID || request.techID > Globals.MAX_TECHNOLOGY_ID) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return new FailureResponse("Invalid parameter");
      }

      const planet: Planet = await this.planetService.getPlanet(headers.user.userID, request.planetID, true);
      const buildings: Buildings = await this.buildingService.getBuildings(request.planetID);
      const techs: Techs = await this.techService.getTechs(headers.user.userID);
      const user: User = await this.userService.getAuthenticatedUser(headers.user.userID);

      if (!InputValidator.isSet(planet)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return new FailureResponse("Invalid parameter");
      }

      if (planet.isUpgradingResearchLab()) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return {
          error: "Planet is upgrading the research-lab",
        };
      }

      // 1. check if there is already a build-job on the planet
      if (user.isResearching()) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return {
          error: "Planet already has a build-job",
        };
      }

      // can't build research lab while they are researching... poor scientists :(
      // if(request.body.techID === Globals.Buildings.RESEARCH_LAB &&
      //     (planet.bTechID > 0 || planet.bTechEndTime > 0)) {
      //
      //     response.status(Globals.Statuscode.SUCCESS).json({
      //         status: Globals.Statuscode.SUCCESS,
      //         error: "Can't build this building while it is in use",
      //         data: {}
      //     });
      //
      //     return;
      // }

      // 2. check, if requirements are met
      const requirements = Config.getGameConfig().units.technologies.find(r => r.unitID === request.techID)
        .requirements;

      // building has requirements
      if (requirements !== undefined) {
        let requirementsMet = true;

        for (const reqID in requirements) {
          if (requirements.hasOwnProperty(reqID)) {
            const reqLevel = requirements[reqID];
            const key = Globals.UnitNames[reqID];

            if (techs[key] < reqLevel) {
              requirementsMet = false;
              break;
            }
          } else {
            // TODO: throw a meaningful error
            throw Error();
          }
        }

        if (!requirementsMet) {
          this.setStatus(Globals.StatusCodes.SUCCESS);

          return new FailureResponse("Requirements are not met");
        }
      }

      // 3. check if there are enough resources on the planet for the building to be built
      const buildingKey = Globals.UnitNames[request.techID];

      const currentLevel = techs[buildingKey];

      const cost = Calculations.getCosts(request.techID, currentLevel);

      if (
        planet.metal < cost.metal ||
        planet.crystal < cost.crystal ||
        planet.deuterium < cost.deuterium ||
        planet.energyMax < cost.energy
      ) {
        this.setStatus(Globals.StatusCodes.SUCCESS);

        return new FailureResponse("Not enough resources");
      }

      // 4. start the build-job
      const buildTime = Calculations.calculateResearchTimeInSeconds(cost.metal, cost.crystal, buildings.researchLab);

      const endTime = Math.round(+new Date() / 1000) + buildTime;

      planet.metal = planet.metal - cost.metal;
      planet.crystal = planet.crystal - cost.crystal;
      planet.deuterium = planet.deuterium - cost.deuterium;
      user.bTechID = request.techID;
      user.bTechEndTime = endTime;

      await this.planetService.updatePlanet(planet);
      await this.userService.updateUserData(user);

      return planet;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }
}
