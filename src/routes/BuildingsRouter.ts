import { IRouter, NextFunction, Response, Router as newRouter } from "express";
import Calculations from "../common/Calculations";
import { Config } from "../common/Config";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";

import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import Buildings from "../units/Buildings";
import Planet from "../units/Planet";
import { ICosts } from "../interfaces/ICosts";
import { Logger } from "../common/Logger";

// const units = new Units();

export default class BuildingsRouter {
  public router: IRouter<{}> = newRouter();

  private buildingService;
  private planetService;

  /**
   * Initialize the Router
   */
  public constructor(container) {
    this.buildingService = container.buildingService;
    this.planetService = container.planetService;

    this.router.get("/:planetID", this.getAllBuildingsOnPlanet);
    this.router.post("/build", this.startBuilding);
    this.router.post("/cancel", this.cancelBuilding);
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
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      // TODO: check if user owns the planet
      const data = await this.buildingService.getBuildings(request.params.planetID);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data,
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  };

  public cancelBuilding = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (!InputValidator.isSet(request.body.planetID) || !InputValidator.isValidInt(request.body.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const buildings: Buildings = await this.buildingService.getBuildings(planetID);

      if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildings)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      if (!planet.isUpgradingBuilding()) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Planet has no build-job",
          data: {},
        });
      }

      const buildingKey = Config.getMappings()[planet.b_building_id];

      const currentLevel = buildings[buildingKey];

      const cost: ICosts = Calculations.getCosts(planet.b_building_id, currentLevel);

      planet.b_building_id = 0;
      planet.b_building_endtime = 0;
      planet.metal = planet.metal + cost.metal;
      planet.crystal = planet.crystal + cost.crystal;
      planet.crystal = planet.crystal + cost.crystal;

      await this.planetService.updatePlanet(planet);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Building canceled",
        data: { planet },
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  };

  public startBuilding = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (
        !InputValidator.isSet(request.body.planetID) ||
        !InputValidator.isValidInt(request.body.planetID) ||
        !InputValidator.isSet(request.body.buildingID) ||
        !InputValidator.isValidInt(request.body.buildingID)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);
      const buildingID = parseInt(request.body.buildingID, 10);

      if (!InputValidator.isValidBuildingId(buildingID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const buildings: Buildings = await this.buildingService.getBuildings(planetID);

      if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildings)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      // 1. check if there is already a build-job on the planet
      if (planet.isUpgradingBuilding()) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Planet already has a build-job",
          data: {},
        });
      }

      // can't build shipyard / robotic / nanite while ships or defenses are built
      if (
        (buildingID === Globals.Buildings.ROBOTIC_FACTORY ||
          buildingID === Globals.Buildings.NANITE_FACTORY ||
          buildingID === Globals.Buildings.SHIPYARD) &&
        InputValidator.isSet(planet.b_hangar_queue) &&
        planet.isBuildingUnits()
      ) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Can't build this building while it is in use",
          data: {},
        });
      }

      // can't build research lab while they are researching... poor scientists :(
      if (buildingID === Globals.Buildings.RESEARCH_LAB && planet.isResearching()) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Can't build this building while it is in use",
          data: {},
        });
      }

      // 2. check, if requirements are met
      const requirements = Config.getRequirements()[buildingID];

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
            status: Globals.Statuscode.SUCCESS,
            message: "Requirements are not met",
            data: {},
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
        planet.energy_used < cost.energy
      ) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Not enough resources",
          data: {},
        });
      }

      // 4. start the build-job
      const buildTime: number = Calculations.calculateBuildTimeInSeconds(
        cost.metal,
        cost.crystal,
        buildings.robotic_factory,
        buildings.nanite_factory,
      );

      const endTime: number = Math.round(+new Date() / 1000) + buildTime;

      planet.metal = planet.metal - cost.metal;
      planet.crystal = planet.crystal - cost.crystal;
      planet.deuterium = planet.deuterium - cost.deuterium;
      planet.b_building_id = buildingID;
      planet.b_building_endtime = endTime;

      await this.planetService.updatePlanet(planet);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Job started",
        data: { planet },
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: `There was an error while handling the request: ${error}`,
        data: {},
      });
    }
  };
}
