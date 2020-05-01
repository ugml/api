import { Response, Router } from "express";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import Planet from "../units/Planet";
import ILogger from "../interfaces/ILogger";
import IPlanetDataAccess from "../interfaces/dataAccess/IPlanetDataAccess";
import PermissionException from "../exceptions/PermissionException";
import InvalidParameterException from "../exceptions/InvalidParameterException";
import UnitDoesNotExistException from "../exceptions/UnitDoesNotExistException";
import Exception from "../exceptions/Exception";

/**
 * Defines routes for planet-data
 */
export default class PlanetsRouter {
  public router: Router = Router();
  private logger: ILogger;
  private planetDataAccess: IPlanetDataAccess;

  public constructor(container, logger: ILogger) {
    this.planetDataAccess = container.planetDataAccess;

    this.router.get("/movement/:planetID", this.getMovement);
    this.router.post("/destroy/", this.destroyPlanet);
    this.router.post("/rename/", this.renamePlanet);
    this.router.get("/:planetID", this.getPlanetByID);

    this.logger = logger;
  }

  public getAllPlanets = async (request: IAuthorizedRequest, response: Response) => {
    try {
      const userID = parseInt(request.userID, 10);

      const planetList = await this.planetDataAccess.getAllPlanetsOfUser(userID, true);

      return response.status(Globals.Statuscode.SUCCESS).json(planetList ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SUCCESS).json({
        error: "There was an error while handling the request",
      });
    }
  };

  public getAllPlanetsOfUser = async (request: IAuthorizedRequest, response: Response) => {
    try {
      const userID = parseInt(request.params.userID, 10);

      const planetList = await this.planetDataAccess.getAllPlanetsOfUser(userID);

      return response.status(Globals.Statuscode.SUCCESS).json(planetList ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SUCCESS).json({
        error: "There was an error while handling the request",
      });
    }
  };

  public getOwnPlanet = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.params.planetID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.params.planetID, 10);

      const planet = await this.planetDataAccess.getPlanetByIDWithFullInformation(planetID);

      if (!InputValidator.isSet(planet)) {
        throw new UnitDoesNotExistException("Planet does not exist");
      }

      if (planet.ownerID !== userID) {
        throw new PermissionException("User does not own the planet");
      }

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

  public getMovement = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.params.planetID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.params.planetID, 10);

      const movement = await this.planetDataAccess.getMovementOnPlanet(userID, planetID);

      return response.status(Globals.Statuscode.SUCCESS).json(movement ?? {});
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

  public destroyPlanet = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.planetID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const planetList = await this.planetDataAccess.getAllPlanetsOfUser(userID);

      if (planetList.length === 1) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "The last planet cannot be destroyed",
        });
      }

      // TODO: if the deleted planet was the current planet -> set another one as current planet
      await this.planetDataAccess.deletePlanet(userID, planetID);

      return response.status(Globals.Statuscode.SUCCESS).json({});
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

  public renamePlanet = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.planetID) || !InputValidator.isSet(request.body.name)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const newName: string = InputValidator.sanitizeString(request.body.name);

      // TODO: check max-length
      if (newName.length <= 4) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "New name is too short",
        });
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

      planet.name = newName;

      await this.planetDataAccess.updatePlanet(planet);

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

  public getPlanetByID = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.params.planetID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const planetID = parseInt(request.params.planetID, 10);

      const planet: Planet = await this.planetDataAccess.getPlanetByIDWithBasicInformation(planetID);

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
