import { NextFunction, Response, Router } from "express";
import { Config } from "../common/Config";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { Units, UnitType } from "../common/Units";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { BuildingService } from "../services/BuildingService";
import { PlanetService } from "../services/PlanetService";
import { Buildings } from "../units/Buildings";
import { Planet } from "../units/Planet";
import { ICosts } from "../interfaces/ICosts";
import { Logger } from "../common/Logger";

const units = new Units();

export class BuildingsRouter {
  public router: Router;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Returns all buildings on a given planet
   * @param request
   * @param response
   * @param next
   */
  public async getAllBuildingsOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      // TODO: check if user owns the planet
      const data = await BuildingService.getBuildings(request.params.planetID);

      // return the result
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
  }

  public async cancelBuilding(request: IAuthorizedRequest, response: Response, next: NextFunction) {
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

      const planet: Planet = await PlanetService.getPlanet(userID, planetID, true);
      const buildings: Buildings = await BuildingService.getBuildings(planetID);

      if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildings)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      // 1. check if there is already a build-job on the planet
      if (planet.b_building_id !== 0 || planet.b_building_endtime !== 0) {
        const buildingKey = units.getMappings()[planet.b_building_id];

        // give back the ressources
        const currentLevel = buildings[buildingKey];

        const cost: ICosts = units.getCosts(planet.b_building_id, currentLevel, UnitType.BUILDING);

        planet.b_building_id = 0;
        planet.b_building_endtime = 0;
        planet.metal = planet.metal + cost.metal;
        planet.crystal = planet.crystal + cost.crystal;
        planet.crystal = planet.crystal + cost.crystal;

        await PlanetService.updatePlanet(planet);

        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Building canceled",
          data: { planet },
        });
      } else {
        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Planet has no build-job",
          data: {},
        });
      }
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  }

  public async startBuilding(request: IAuthorizedRequest, response: Response, next: NextFunction) {
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

      if (request.body.buildingID < Globals.MIN_BUILDING_ID || request.body.buildingID > Globals.MAX_BUILDING_ID) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const planet: Planet = await PlanetService.getPlanet(userID, planetID, true);
      const buildings: Buildings = await BuildingService.getBuildings(planetID);

      if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildings)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      // 1. check if there is already a build-job on the planet
      if (planet.b_building_id !== 0 || planet.b_building_endtime !== 0) {
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
        (planet.b_hangar_id.length > 0 || planet.b_hangar_start_time > 0)
      ) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Can't build this building while it is in use",
          data: {},
        });
      }

      // can't build research lab while they are researching... poor scientists :(
      if (buildingID === Globals.Buildings.RESEARCH_LAB && (planet.b_tech_id > 0 || planet.b_tech_endtime > 0)) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Can't build this building while it is in use",
          data: {},
        });
      }

      // 2. check, if requirements are met
      const requirements = units.getRequirements()[buildingID];

      // building has requirements
      if (requirements !== undefined) {
        let requirementsMet = true;

        for (const reqID in requirements) {
          if (requirements.hasOwnProperty(reqID)) {
            const reqLevel = requirements[reqID];
            const key = units.getMappings()[buildingID];

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
            data: planet.planetID,
          });
        }
      }

      // 3. check if there are enough resources on the planet for the building to be built
      const buildingKey = units.getMappings()[buildingID];
      const currentLevel = buildings[buildingKey];

      const cost = units.getCosts(buildingID, currentLevel, UnitType.BUILDING);

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
      const buildTime: number = Math.round(
        (cost.metal + cost.crystal) /
          (2500 * (1 + buildings.robotic_factory) * 2 ** buildings.nanite_factory * Config.Get.speed),
      );

      const endTime: number = Math.round(+new Date() / 1000) + buildTime;

      planet.metal = planet.metal - cost.metal;
      planet.crystal = planet.crystal - cost.crystal;
      planet.deuterium = planet.deuterium - cost.deuterium;
      planet.b_building_id = buildingID;
      planet.b_building_endtime = endTime;

      const updateSuccessful = await PlanetService.updatePlanet(planet);

      if (!updateSuccessful) {
        // TODO: throw something more meaningful
        throw Error();
      }

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
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  public init() {
    this.router.get("/:planetID", this.getAllBuildingsOnPlanet);
    this.router.post("/build", this.startBuilding);
    this.router.post("/cancel", this.cancelBuilding);
  }
}

const buildingRoutes = new BuildingsRouter();
buildingRoutes.init();

export default buildingRoutes.router;
