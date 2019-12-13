import { IRouter, NextFunction, Response, Router as newRouter } from "express";
import Calculations from "../common/Calculations";
import Config from "../common/Config";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import IBuildingService from "../interfaces/IBuildingService";
import ICosts from "../interfaces/ICosts";
import Logger from "../common/Logger";
import IPlanetService from "../interfaces/IPlanetService";
import ITechService from "../interfaces/ITechService";
import Buildings from "../units/Buildings";
import Planet from "../units/Planet";
import Techs from "../units/Techs";

/**
 * Defines routes for technology-data
 */
export default class TechsRouter {
  public router: IRouter = newRouter();

  private planetService: IPlanetService;
  private buildingService: IBuildingService;
  private techService: ITechService;

  /**
   * Registers the routes and needed services
   * @param container the IoC-container with registered services
   */
  public constructor(container) {
    this.planetService = container.planetService;
    this.buildingService = container.buildingService;
    this.techService = container.techService;

    this.router.get("/", this.getTechs);
    this.router.post("/build/", this.buildTech);
    this.router.post("/cancel/", this.cancelTech);
  }

  /**
   * Returns all technologies of a given user
   * @param request
   * @param response
   * @param next
   */
  public getTechs = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      const userID = parseInt(request.userID, 10);

      const techs: Techs = await this.techService.getTechs(userID);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: techs,
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

  /**
   * Cancels a currently researching technology
   * @param request
   * @param response
   * @param next
   */
  public cancelTech = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
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
      const techs: Techs = await this.techService.getTechs(userID);

      // player does not own the planet
      if (!InputValidator.isSet(planet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      // 1. check if there is already a build-job on the planet
      if (planet.b_tech_id === 0 && planet.b_tech_endtime === 0) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Planet has no build-job",
          data: {},
        });
      }

      const techKey = Config.getMappings()[planet.b_tech_id];

      const currentLevel = techs[techKey];

      const cost: ICosts = Calculations.getCosts(planet.b_tech_id, currentLevel);

      planet.metal += cost.metal;
      planet.crystal += cost.crystal;
      planet.deuterium += cost.deuterium;
      planet.b_tech_id = 0;
      planet.b_tech_endtime = 0;

      await this.planetService.updatePlanet(planet);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Tech canceled",
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

  /**
   * Starts researching a new technology
   * @param request
   * @param response
   * @param next
   */
  public buildTech = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (
        !InputValidator.isSet(request.body.planetID) ||
        !InputValidator.isValidInt(request.body.planetID) ||
        !InputValidator.isSet(request.body.techID) ||
        !InputValidator.isValidInt(request.body.techID)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);
      const techID = parseInt(request.body.techID, 10);

      if (request.body.techID < Globals.MIN_TECHNOLOGY_ID || request.body.techID > Globals.MAX_TECHNOLOGY_ID) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const buildings: Buildings = await this.buildingService.getBuildings(planetID);
      const techs: Techs = await this.techService.getTechs(userID);

      if (!InputValidator.isSet(planet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      if (planet.isUpgradingResearchLab()) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Planet is upgrading the research-lab",
          data: {},
        });
      }

      // 1. check if there is already a build-job on the planet
      if (planet.isResearching()) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Planet already has a build-job",
          data: {},
        });
      }

      // can't build research lab while they are researching... poor scientists :(
      // if(request.body.techID === Globals.Buildings.RESEARCH_LAB &&
      //     (planet.b_tech_id > 0 || planet.b_tech_endtime > 0)) {
      //
      //     response.status(Globals.Statuscode.SUCCESS).json({
      //         status: Globals.Statuscode.SUCCESS,
      //         message: "Can't build this building while it is in use",
      //         data: {}
      //     });
      //
      //     return;
      // }

      // 2. check, if requirements are met
      const requirements = Config.getRequirements()[techID];

      // building has requirements
      if (requirements !== undefined) {
        let requirementsMet = true;

        for (const reqID in requirements) {
          if (requirements.hasOwnProperty(reqID)) {
            const reqLevel = requirements[reqID];
            const key = Config.getMappings()[reqID];

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
          return response.status(Globals.Statuscode.SUCCESS).json({
            status: Globals.Statuscode.SUCCESS,
            message: "Requirements are not met",
            data: planet.planetID,
          });
        }
      }

      // 3. check if there are enough resources on the planet for the building to be built
      const buildingKey = Config.getMappings()[techID];

      const currentLevel = techs[buildingKey];

      const cost = Calculations.getCosts(techID, currentLevel);

      if (
        planet.metal < cost.metal ||
        planet.crystal < cost.crystal ||
        planet.deuterium < cost.deuterium ||
        planet.energy_max < cost.energy
      ) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Not enough resources",
          data: {},
        });
      }

      // 4. start the build-job
      const buildTime = Calculations.calculateResearchTimeInSeconds(cost.metal, cost.crystal, buildings.research_lab);

      const endTime = Math.round(+new Date() / 1000) + buildTime;

      planet.metal = planet.metal - cost.metal;
      planet.crystal = planet.crystal - cost.crystal;
      planet.deuterium = planet.deuterium - cost.deuterium;
      planet.b_tech_id = techID;
      planet.b_tech_endtime = endTime;

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
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  };
}
