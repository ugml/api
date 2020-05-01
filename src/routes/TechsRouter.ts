import { Response, Router } from "express";
import Calculations from "../common/Calculations";
import Config from "../common/Config";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import ICosts from "../interfaces/ICosts";
import Buildings from "../units/Buildings";
import Planet from "../units/Planet";
import Techs from "../units/Techs";
import User from "../units/User";
import ILogger from "../interfaces/ILogger";
import IUserDataAccess from "../interfaces/dataAccess/IUserDataAccess";
import IPlanetDataAccess from "../interfaces/dataAccess/IPlanetDataAccess";
import IBuildingsDataAccess from "../interfaces/dataAccess/IBuildingsDataAccess";
import ITechDataAccess from "../interfaces/dataAccess/ITechDataAccess";
import PermissionException from "../exceptions/PermissionException";
import InvalidParameterException from "../exceptions/InvalidParameterException";
import UnitDoesNotExistException from "../exceptions/UnitDoesNotExistException";
import Exception from "../exceptions/Exception";

/**
 * Defines routes for technology-data
 */
export default class TechsRouter {
  public router: Router = Router();
  private logger: ILogger;
  private userDataAccess: IUserDataAccess;
  private planetDataAccess: IPlanetDataAccess;
  private buildingsDataAccess: IBuildingsDataAccess;
  private techDataAccess: ITechDataAccess;

  public constructor(container, logger: ILogger) {
    this.userDataAccess = container.userDataAccess;
    this.planetDataAccess = container.planetDataAccess;
    this.buildingsDataAccess = container.buildingsDataAccess;
    this.techDataAccess = container.techDataAccess;

    this.router.get("/", this.getTechnologies);
    this.router.post("/build/", this.buildTechnology);
    this.router.post("/cancel/", this.cancelTechnology);

    this.logger = logger;
  }

  public getTechnologies = async (request: IAuthorizedRequest, response: Response) => {
    try {
      const userID = parseInt(request.userID, 10);

      const techs: Techs = await this.techDataAccess.getTechs(userID);

      return response.status(Globals.Statuscode.SUCCESS).json(techs ?? {});
    } catch (error) {
      if (error instanceof Exception) {
        return response.status(error.statusCode).json({
          error: error.message,
        });
      }

      this.logger.error(error.message, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request",
      });
    }
  };

  public cancelTechnology = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.planetID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const planet: Planet = await this.planetDataAccess.getPlanetByIDWithFullInformation(planetID);

      if (!InputValidator.isSet(planet)) {
        throw new UnitDoesNotExistException("Planet does not exist");
      }

      if (planet.ownerID !== userID) {
        throw new PermissionException("User does not own the planet");
      }

      const techs: Techs = await this.techDataAccess.getTechs(userID);
      const user: User = await this.userDataAccess.getAuthenticatedUser(userID);

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

      await this.planetDataAccess.updatePlanet(planet);
      await this.userDataAccess.updateUserData(user);

      return response.status(Globals.Statuscode.SUCCESS).json(planet ?? {});
    } catch (error) {
      if (error instanceof Exception) {
        return response.status(error.statusCode).json({
          error: error.message,
        });
      }

      this.logger.error(error.message, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request",
      });
    }
  };

  public buildTechnology = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (
        !InputValidator.isSet(request.body.planetID) ||
        !InputValidator.isValidInt(request.body.planetID) ||
        !InputValidator.isSet(request.body.techID) ||
        !InputValidator.isValidInt(request.body.techID)
      ) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);
      const techID = parseInt(request.body.techID, 10);

      if (request.body.techID < Globals.MIN_TECHNOLOGY_ID || request.body.techID > Globals.MAX_TECHNOLOGY_ID) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const planet: Planet = await this.planetDataAccess.getPlanetByIDWithFullInformation(planetID);

      if (!InputValidator.isSet(planet)) {
        throw new UnitDoesNotExistException("Planet does not exist");
      }

      if (planet.ownerID !== userID) {
        throw new PermissionException("User does not own the planet");
      }

      const buildings: Buildings = await this.buildingsDataAccess.getBuildings(planetID);
      const techs: Techs = await this.techDataAccess.getTechs(userID);
      const user: User = await this.userDataAccess.getAuthenticatedUser(userID);

      if (!InputValidator.isSet(planet)) {
        throw new InvalidParameterException("Invalid parameter");
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

      await this.planetDataAccess.updatePlanet(planet);
      await this.userDataAccess.updateUserData(user);

      return response.status(Globals.Statuscode.SUCCESS).json(planet ?? {});
    } catch (error) {
      if (error instanceof Exception) {
        return response.status(error.statusCode).json({
          error: error.message,
        });
      }

      this.logger.error(error.message, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request",
      });
    }
  };
}
