import { Response, Router } from "express";
import Calculations from "../common/Calculations";
import Config from "../common/Config";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import ILogger from "../interfaces/ILogger";
import IBuildingService from "../interfaces/IBuildingService";
import IPlanetService from "../interfaces/IPlanetService";
import IUserService from "../interfaces/IUserService";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import Planet from "../units/Planet";
import Buildings from "../units/Buildings";
import User from "../units/User";
import ICosts from "../interfaces/ICosts";

import IBuildableUnit from "../interfaces/IBuildableUnit";
import { IRequirement } from "../interfaces/IGameConfig";

/**
 * Defines routes for building-data
 */
export default class BuildingsRouter {
  public router: Router = Router();

  private logger: ILogger;

  private buildingService: IBuildingService;
  private planetService: IPlanetService;
  private userService: IUserService;

  public constructor(container, logger: ILogger) {
    this.buildingService = container.buildingService;
    this.planetService = container.planetService;
    this.userService = container.userService;

    this.router.post("/build", this.startBuilding);
    this.router.post("/cancel", this.cancelBuilding);
    this.router.post("/demolish", this.demolishBuilding);
    this.router.get("/:planetID", this.getAllBuildingsOnPlanet);

    this.logger = logger;
  }

  /**
   * Returns all buildings on a given planet
   * @param request
   * @param response
   */
  public getAllBuildingsOnPlanet = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const planetID: number = parseInt(request.params.planetID, 10);

      const userID = parseInt(request.userID, 10);
      const planet: Planet = await this.planetService.getPlanet(1, planetID, false);

      if (!InputValidator.isSet(planet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Planet does not exist.",
        });
      }

      if (planet.ownerID !== userID) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "User does not own the planet.",
        });
      }

      const data = await this.buildingService.getBuildings(planetID);

      return response.status(Globals.Statuscode.SUCCESS).json(data ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  /**
   * Cancels a build-order on a planet
   * @param request
   * @param response
   */
  public cancelBuilding = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const buildingsOnPlanet: Buildings = await this.buildingService.getBuildings(planetID);

      if (!InputValidator.isSet(buildingsOnPlanet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      if (!planet.isUpgradingBuilding()) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          error: "Planet has no build-job",
        });
      }

      const buildingKey = Globals.UnitNames[planet.bBuildingId];
      const currentLevel = buildingsOnPlanet[buildingKey];
      const costs: ICosts = Calculations.getCosts(planet.bBuildingId, currentLevel);

      planet.substractCosts(costs);
      planet.cancelBuilding();

      await this.planetService.updatePlanet(planet);

      return response.status(Globals.Statuscode.SUCCESS).json(planet ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  /**
   * Starts a new build-order
   * @param request
   * @param response
   */
  public startBuilding = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.planetID) || !InputValidator.isValidInt(request.body.buildingID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const buildingID = parseInt(request.body.buildingID, 10);

      if (!InputValidator.isValidBuildingId(buildingID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const buildingsOnPlanet: Buildings = await this.buildingService.getBuildings(planetID);
      const user: User = await this.userService.getAuthenticatedUser(userID);

      if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildingsOnPlanet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      if (planet.isUpgradingBuilding()) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          error: "Planet already has a build-job",
        });
      }

      if (
        (buildingID === Globals.Buildings.ROBOTIC_FACTORY ||
          buildingID === Globals.Buildings.NANITE_FACTORY ||
          buildingID === Globals.Buildings.SHIPYARD) &&
        InputValidator.isSet(planet.bHangarQueue) &&
        planet.isBuildingUnits()
      ) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          error: "Can't build this building while it is in use",
        });
      }

      if (buildingID === Globals.Buildings.RESEARCH_LAB && user.isResearching()) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          error: "Can't build this building while it is in use",
        });
      }

      const requirements = Config.getGameConfig().units.buildings.find(r => r.unitID === buildingID).requirements;

      if (!this.meetsRequirements(buildingsOnPlanet, requirements)) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          error: "Requirements are not met",
        });
      }

      const buildingKey = Globals.UnitNames[buildingID];
      const currentLevel = buildingsOnPlanet[buildingKey];
      const costs = Calculations.getCosts(buildingID, currentLevel);

      // 3. check if there are enough resources on the planet for the building to be built
      if (!planet.hasEnoughResources(costs)) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          error: "Not enough resources",
        });
      }

      // 4. start the build-job
      const buildTime: number = this.calculateBuildTime(buildingID, buildingsOnPlanet);

      planet.substractCosts(costs);
      await this.startBuildJob(buildTime, planet, buildingID);

      return response.status(Globals.Statuscode.SUCCESS).json(planet ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  public demolishBuilding = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.planetID) || !InputValidator.isValidInt(request.body.buildingID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);
      const buildingID = parseInt(request.body.buildingID, 10);

      if (!InputValidator.isValidBuildingId(buildingID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const buildingsOnPlanet: Buildings = await this.buildingService.getBuildings(planetID);

      if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildingsOnPlanet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      if (planet.isUpgradingBuilding()) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Planet already has a build-job",
        });
      }

      if (!this.isBuildingDemolishable(buildingID, buildingsOnPlanet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "This building can't be demolished",
        });
      }

      const buildTime = this.calculateBuildTime(buildingID, buildingsOnPlanet);

      this.startDemolitionJob(buildingID, buildTime, planet);

      return response.status(Globals.Statuscode.SUCCESS).json(planet ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  private calculateBuildTime(buildingID: number, buildingsOnPlanet: Buildings) {
    const buildingKey = Globals.UnitNames[buildingID];
    const currentLevel = buildingsOnPlanet[buildingKey];
    const cost = Calculations.getCosts(buildingID, currentLevel - 1);

    return Calculations.calculateBuildTimeInSeconds(
      cost.metal,
      cost.crystal,
      buildingsOnPlanet.roboticFactory,
      buildingsOnPlanet.naniteFactory,
    );
  }

  private isBuildingDemolishable(buildingID: number, buildingsOnPlanet: Buildings): boolean {
    const buildingKey = Globals.UnitNames[buildingID];
    const currentLevel = buildingsOnPlanet[buildingKey];

    return currentLevel > 0;
  }

  private async startDemolitionJob(buildingID: number, buildTime: number, planet: Planet) {
    const endTime: number = Math.round(+new Date() / 1000) + buildTime;

    planet.bBuildingId = buildingID;
    planet.bBuildingEndTime = endTime;
    planet.bBuildingDemolition = true;

    await this.planetService.updatePlanet(planet);
  }

  private async startBuildJob(buildTime: number, planet: Planet, buildingID: number): Promise<void> {
    const endTime: number = Math.round(+new Date() / 1000) + buildTime;

    planet.bBuildingId = buildingID;
    planet.bBuildingEndTime = endTime;

    await this.planetService.updatePlanet(planet);
  }

  private meetsRequirements(unitsAvailable: IBuildableUnit, requirements: IRequirement[]): boolean {
    if (!InputValidator.isSet(requirements)) {
      return true;
    }

    for (const requirement of requirements) {
      const key = Globals.UnitNames[requirement.unitID];

      if (unitsAvailable[key] < requirement.level) {
        return false;
      }
    }

    return true;
  }
}
