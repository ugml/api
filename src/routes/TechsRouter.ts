import { NextFunction, Response, Router } from "express";
import Calculations from "../common/Calculations";
import Config from "../common/Config";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import IBuildingService from "../interfaces/IBuildingService";
import ICosts from "../interfaces/ICosts";
import IPlanetService from "../interfaces/IPlanetService";
import ITechService from "../interfaces/ITechService";
import Buildings from "../units/Buildings";
import Planet from "../units/Planet";
import Techs from "../units/Techs";
import User from "../units/User";
import IUserService from "../interfaces/IUserService";
import ILogger from "../interfaces/ILogger";

/**
 * Defines routes for technology-data
 */
export default class TechsRouter {
  public router: Router = Router();

  private logger: ILogger;

  private userService: IUserService;
  private planetService: IPlanetService;
  private buildingService: IBuildingService;
  private techService: ITechService;

  /**
   * Registers the routes and needed services
   * @param container the IoC-container with registered services
   * @param logger Instance of an ILogger-object
   */
  public constructor(container, logger: ILogger) {
    this.userService = container.userService;
    this.planetService = container.planetService;
    this.buildingService = container.buildingService;
    this.techService = container.techService;

    this.router.get("/", this.getTechs);
    this.router.post("/build/", this.buildTech);
    this.router.post("/cancel/", this.cancelTech);

    this.logger = logger;
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

      return response.status(Globals.Statuscode.SUCCESS).json(techs ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
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
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const techs: Techs = await this.techService.getTechs(userID);
      const user: User = await this.userService.getAuthenticatedUser(userID);

      // player does not own the planet
      if (!InputValidator.isSet(planet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      // 1. check if there is already a build-job on the planet
      if (user.bTechID === 0 && user.bTechEndTime === 0) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Planet has no build-job",
        });
      }

      const techKey = Globals.UnitNames[user.bTechID];

      const currentLevel = techs[techKey];

      const cost: ICosts = Calculations.getCosts(user.bTechID, currentLevel);

      planet.metal += cost.metal;
      planet.crystal += cost.crystal;
      planet.deuterium += cost.deuterium;
      user.bTechID = 0;
      user.bTechEndTime = 0;

      await this.planetService.updatePlanet(planet);
      await this.userService.updateUserData(user);

      return response.status(Globals.Statuscode.SUCCESS).json(planet ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
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
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);
      const techID = parseInt(request.body.techID, 10);

      if (request.body.techID < Globals.MIN_TECHNOLOGY_ID || request.body.techID > Globals.MAX_TECHNOLOGY_ID) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const buildings: Buildings = await this.buildingService.getBuildings(planetID);
      const techs: Techs = await this.techService.getTechs(userID);
      const user: User = await this.userService.getAuthenticatedUser(userID);

      if (!InputValidator.isSet(planet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      if (planet.isUpgradingResearchLab()) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Planet is upgrading the research-lab",
        });
      }

      // 1. check if there is already a build-job on the planet
      if (user.isResearching()) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Planet already has a build-job",
        });
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
      const requirements = Config.getGameConfig().units.technologies.find(r => r.unitID === techID).requirements;

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
          return response.status(Globals.Statuscode.SUCCESS).json({
            error: "Requirements are not met",
          });
        }
      }

      // 3. check if there are enough resources on the planet for the building to be built
      const buildingKey = Globals.UnitNames[techID];

      const currentLevel = techs[buildingKey];

      const cost = Calculations.getCosts(techID, currentLevel);

      if (
        planet.metal < cost.metal ||
        planet.crystal < cost.crystal ||
        planet.deuterium < cost.deuterium ||
        planet.energyMax < cost.energy
      ) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          error: "Not enough resources",
        });
      }

      // 4. start the build-job
      const buildTime = Calculations.calculateResearchTimeInSeconds(cost.metal, cost.crystal, buildings.researchLab);

      const endTime = Math.round(+new Date() / 1000) + buildTime;

      planet.metal = planet.metal - cost.metal;
      planet.crystal = planet.crystal - cost.crystal;
      planet.deuterium = planet.deuterium - cost.deuterium;
      user.bTechID = techID;
      user.bTechEndTime = endTime;

      await this.planetService.updatePlanet(planet);
      await this.userService.updateUserData(user);

      return response.status(Globals.Statuscode.SUCCESS).json(planet ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };
}
