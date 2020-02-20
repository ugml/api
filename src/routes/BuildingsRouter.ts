import { NextFunction, Response, Router as newRouter } from "express";
import Calculations from "../common/Calculations";
import Config from "../common/Config";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";

import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import IBuildingService from "../interfaces/IBuildingService";
import IPlanetService from "../interfaces/IPlanetService";
import Buildings from "../units/Buildings";
import Planet from "../units/Planet";
import ICosts from "../interfaces/ICosts";
import Logger from "../common/Logger";
import User from "../units/User";
import IUserService from "../interfaces/IUserService";

/**
 * Defines routes for building-data
 */
export default class BuildingsRouter {
  public router = newRouter();

  private buildingService: IBuildingService;
  private planetService: IPlanetService;
  private userService: IUserService;

  /**
   * Registers the routes and needed services
   * @param container the IoC-container with registered services
   */
  public constructor(container) {
    this.buildingService = container.buildingService;
    this.planetService = container.planetService;
    this.userService = container.userService;

    this.router.post("/build", this.startBuilding);
    this.router.post("/cancel", this.cancelBuilding);
    this.router.post("/demolish", this.demolishBuilding);
    this.router.get("/:planetID", this.getAllBuildingsOnPlanet);
  }

  /**
   * Returns all buildings on a given planet
   * @param request
   * @param response
   * @param next
   */
  public getAllBuildingsOnPlanet = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const planetID: number = parseInt(request.params.planetID, 10);

      // TODO: check if user owns the planet
      const data = await this.buildingService.getBuildings(planetID);

      return response.status(Globals.Statuscode.SUCCESS).json(data);
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  /**
   * Cancels a build-order on a planet
   * @param request
   * @param response
   * @param next
   */
  public cancelBuilding = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (!InputValidator.isSet(request.body.planetID) || !InputValidator.isValidInt(request.body.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const buildings: Buildings = await this.buildingService.getBuildings(planetID);

      if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildings)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      if (!planet.isUpgradingBuilding()) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          error: "Planet has no build-job",
        });
      }

      const buildingKey = Config.getMappings()[planet.bBuildingId];

      const currentLevel = buildings[buildingKey];

      const cost: ICosts = Calculations.getCosts(planet.bBuildingId, currentLevel);

      planet.bBuildingId = 0;
      planet.bBuildingEndTime = 0;
      planet.metal = planet.metal + cost.metal;
      planet.crystal = planet.crystal + cost.crystal;
      planet.crystal = planet.crystal + cost.crystal;

      await this.planetService.updatePlanet(planet);

      return response.status(Globals.Statuscode.SUCCESS).json(planet);
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        error: "There was an error while handling the request.",
      });
    }
  };

  /**
   * Starts a new build-order
   * @param request
   * @param response
   * @param next
   */
  public startBuilding = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (
        !InputValidator.isSet(request.body.planetID) ||
        !InputValidator.isValidInt(request.body.planetID) ||
        !InputValidator.isSet(request.body.buildingID) ||
        !InputValidator.isValidInt(request.body.buildingID)
      ) {
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
      const buildings: Buildings = await this.buildingService.getBuildings(planetID);
      const user: User = await this.userService.getAuthenticatedUser(userID);

      if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildings)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      // 1. check if there is already a build-job on the planet
      if (planet.isUpgradingBuilding()) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          error: "Planet already has a build-job",
        });
      }

      // can't build shipyard / robotic / nanite while ships or defenses are built
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

      // can't build research lab while they are researching... poor scientists :(
      if (buildingID === Globals.Buildings.RESEARCH_LAB && user.isResearching()) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          error: "Can't build this building while it is in use",
        });
      }

      // 2. check, if requirements are met
      const requirements = Config.getRequirements().find(r => r.unitID === buildingID);

      // TODO: move to seperate file
      // building has requirements
      if (requirements !== undefined) {
        let requirementsMet = true;

        for (const reqID in requirements) {
          if (requirements.hasOwnProperty(reqID)) {
            const reqLevel = requirements[reqID];
            const key = Config.getMappings()[buildingID];

            if (buildings[key] < reqLevel) {
              requirementsMet = false;
              break;
            }
          } else {
            // TODO: throw a meaningful error
            throw Error();
          }
        }

        if (!requirementsMet) {
          return response.status(Globals.Statuscode.SUCCESS).json({
            error: "Requirements are not met",
          });
        }
      }

      // 3. check if there are enough resources on the planet for the building to be built
      const buildingKey = Config.getMappings()[buildingID];
      const currentLevel = buildings[buildingKey];

      const cost = Calculations.getCosts(buildingID, currentLevel);

      if (
        planet.metal < cost.metal ||
        planet.crystal < cost.crystal ||
        planet.deuterium < cost.deuterium ||
        planet.energyUsed < cost.energy
      ) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          error: "Not enough resources",
        });
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

      return response.status(Globals.Statuscode.SUCCESS).json(planet);
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        error: "There was an error while handling the request.",
      });
    }
  };

  public demolishBuilding = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (
        !InputValidator.isSet(request.body.planetID) ||
        !InputValidator.isValidInt(request.body.planetID) ||
        !InputValidator.isSet(request.body.buildingID) ||
        !InputValidator.isValidInt(request.body.buildingID)
      ) {
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
      const buildings: Buildings = await this.buildingService.getBuildings(planetID);

      if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildings)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      if (planet.isUpgradingBuilding()) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Planet already has a build-job",
        });
      }

      const buildingKey = Config.getMappings()[buildingID];
      const currentLevel = buildings[buildingKey];

      if (currentLevel === 0) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "This building can't be demolished",
        });
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

      return response.status(Globals.Statuscode.SUCCESS).json(planet);
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        error: "There was an error while handling the request.",
      });
    }
  };
}
