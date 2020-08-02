import Calculations from "../common/Calculations";
import Config from "../common/Config";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import ILogger from "../interfaces/ILogger";
import IBuildingService from "../interfaces/services/IBuildingService";
import IPlanetService from "../interfaces/services/IPlanetService";
import IUserService from "../interfaces/services/IUserService";

import Planet from "../units/Planet";
import Buildings from "../units/Buildings";
import User from "../units/User";
import ICosts from "../interfaces/ICosts";
import { inject } from "inversify";
import TYPES from "../ioc/types";
import { Body, Controller, Get, Post, Request, Route, Security, SuccessResponse, Tags } from "tsoa";
import { provide } from "inversify-binding-decorators";

import CancelBuildingRequest from "../entities/requests/CancelBuildingRequest";
import BuildBuildingRequest from "../entities/requests/BuildBuildingRequest";
import DemolishBuildingRequest from "../entities/requests/DemolishBuildingRequest";

/**
 * Defines routes for building-data
 */
@Tags("Buildings")
@Route("buildings")
@provide(BuildingsRouter)
export class BuildingsRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IBuildingService) private buildingService: IBuildingService;
  @inject(TYPES.IPlanetService) private planetService: IPlanetService;
  @inject(TYPES.IUserService) private userService: IUserService;

  @Security("jwt")
  @Get("/{planetID}")
  @SuccessResponse(Globals.StatusCodes.SUCCESS)
  public async getAllBuildingsOnPlanet(@Request() request, planetID: number) {
    try {
      if (!(await this.planetService.checkPlayerOwnsPlanet(request.user.userID, planetID))) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return {
          error: "Invalid parameter",
        };
      }

      return await this.buildingService.getBuildings(planetID);
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);
      return {
        error: "There was an error while handling the request.",
      };
    }
  }

  @Security("jwt")
  @Post("/build")
  @SuccessResponse(Globals.StatusCodes.SUCCESS)
  public async startBuilding(@Request() headers, @Body() request: BuildBuildingRequest) {
    try {
      const userID = headers.user.userID;
      const planetID = request.planetID;
      const buildingID = request.buildingID;

      if (!InputValidator.isValidBuildingId(buildingID)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return {
          error: "Invalid parameter",
        };
      }

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const buildings: Buildings = await this.buildingService.getBuildings(planetID);
      const user: User = await this.userService.getAuthenticatedUser(userID);

      if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildings)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return {
          error: "Invalid parameter",
        };
      }

      // 1. check if there is already a build-job on the planet
      if (planet.isUpgradingBuilding()) {
        this.setStatus(Globals.StatusCodes.SUCCESS);

        return {
          error: "Planet already has a build-job",
        };
      }

      // can't build shipyard / robotic / nanite while ships or defenses are built
      if (
        (buildingID === Globals.Buildings.ROBOTIC_FACTORY ||
          buildingID === Globals.Buildings.NANITE_FACTORY ||
          buildingID === Globals.Buildings.SHIPYARD) &&
        InputValidator.isSet(planet.bHangarQueue) &&
        planet.isBuildingUnits()
      ) {
        this.setStatus(Globals.StatusCodes.SUCCESS);

        return {
          error: "Can't build this building while it is in use",
        };
      }

      // can't build research lab while they are researching... poor scientists :(
      if (buildingID === Globals.Buildings.RESEARCH_LAB && user.isResearching()) {
        this.setStatus(Globals.StatusCodes.SUCCESS);

        return {
          error: "Can't build this building while it is in use",
        };
      }

      // 2. check, if requirements are met
      const requirements = Config.getGameConfig().units.buildings.find(r => r.unitID === buildingID).requirements;

      // TODO: move to seperate file
      // building has requirements
      if (requirements !== undefined) {
        requirements.forEach(function(requirement) {
          const key = Globals.UnitNames[requirement.unitID];

          if (buildings[key] < requirement.level) {
            this.setStatus(Globals.StatusCodes.SUCCESS);

            return {
              error: "Requirements are not met",
            };
          }
        });
      }

      // 3. check if there are enough resources on the planet for the building to be built
      const buildingKey = Globals.UnitNames[buildingID];
      const currentLevel = buildings[buildingKey];

      const cost = Calculations.getCosts(buildingID, currentLevel);

      if (
        planet.metal < cost.metal ||
        planet.crystal < cost.crystal ||
        planet.deuterium < cost.deuterium ||
        planet.energyUsed < cost.energy
      ) {
        this.setStatus(Globals.StatusCodes.SUCCESS);

        return {
          error: "Not enough resources",
        };
      }

      // 4. start the build-job
      const buildTime: number = Calculations.calculateBuildTimeInSeconds(
        cost.metal,
        cost.crystal,
        buildings.roboticFactory,
        buildings.naniteFactory,
      );

      const endTime: number = Math.round(+new Date() / 1000) + buildTime;

      planet.metal = planet.metal - cost.metal;
      planet.crystal = planet.crystal - cost.crystal;
      planet.deuterium = planet.deuterium - cost.deuterium;
      planet.bBuildingId = buildingID;
      planet.bBuildingEndTime = endTime;

      await this.planetService.updatePlanet(planet);

      this.setStatus(Globals.StatusCodes.SUCCESS);

      return planet;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return {
        error: "There was an error while handling the request.",
      };
    }
  }

  @Security("jwt")
  @Post("/cancel")
  @SuccessResponse(Globals.StatusCodes.SUCCESS)
  public async cancelBuilding(@Request() headers, @Body() request: CancelBuildingRequest) {
    try {
      const userID = headers.user.userID;
      const planetID = request.planetID;

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const buildings: Buildings = await this.buildingService.getBuildings(planetID);

      if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildings)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return {
          error: "Invalid parameter",
        };
      }

      if (!planet.isUpgradingBuilding()) {
        this.setStatus(Globals.StatusCodes.SUCCESS);
        return {
          error: "Planet has no build-job",
        };
      }

      const buildingKey = Globals.UnitNames[planet.bBuildingId];

      const currentLevel = buildings[buildingKey];

      const cost: ICosts = Calculations.getCosts(planet.bBuildingId, currentLevel);

      planet.bBuildingId = 0;
      planet.bBuildingEndTime = 0;
      planet.metal = planet.metal + cost.metal;
      planet.crystal = planet.crystal + cost.crystal;
      planet.deuterium = planet.deuterium + cost.deuterium;

      await this.planetService.updatePlanet(planet);

      this.setStatus(Globals.StatusCodes.SUCCESS);

      return planet;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return {
        error: "There was an error while handling the request.",
      };
    }
  }

  @Security("jwt")
  @Post("/demolish")
  @SuccessResponse(Globals.StatusCodes.SUCCESS)
  public async demolishBuilding(@Request() headers, @Body() request: DemolishBuildingRequest) {
    try {
      const userID = headers.user.userID;
      const planetID = request.planetID;
      const buildingID = request.buildingID;

      if (!InputValidator.isValidBuildingId(buildingID)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return {
          error: "Invalid parameter",
        };
      }

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const buildings: Buildings = await this.buildingService.getBuildings(planetID);

      if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildings)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return {
          error: "Invalid parameter",
        };
      }

      if (planet.isUpgradingBuilding()) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return {
          error: "Planet already has a build-job",
        };
      }

      const buildingKey = Globals.UnitNames[buildingID];
      const currentLevel = buildings[buildingKey];

      if (currentLevel === 0) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return {
          error: "This building can't be demolished",
        };
      }

      const cost = Calculations.getCosts(buildingID, currentLevel - 1);

      const buildTime: number = Calculations.calculateBuildTimeInSeconds(
        cost.metal,
        cost.crystal,
        buildings.roboticFactory,
        buildings.naniteFactory,
      );

      const endTime: number = Math.round(+new Date() / 1000) + buildTime;

      planet.bBuildingId = buildingID;
      planet.bBuildingEndTime = endTime;
      planet.bBuildingDemolition = true;

      await this.planetService.updatePlanet(planet);

      this.setStatus(Globals.StatusCodes.SUCCESS);

      return planet;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return {
        error: "There was an error while handling the request.",
      };
    }
  }
}
