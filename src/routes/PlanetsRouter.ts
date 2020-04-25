import { Response, Router } from "express";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import IPlanetService from "../interfaces/IPlanetService";
import Planet from "../units/Planet";
import ILogger from "../interfaces/ILogger";

/**
 * Defines routes for planet-data
 */
export default class PlanetsRouter {
  public router: Router = Router();
  private logger: ILogger;
  private planetService: IPlanetService;

  public constructor(container, logger: ILogger) {
    this.planetService = container.planetService;

    this.router.get("/movement/:planetID", this.getMovement);
    this.router.post("/destroy/", this.destroyPlanet);
    this.router.post("/rename/", this.renamePlanet);
    this.router.get("/:planetID", this.getPlanetByID);

    this.logger = logger;
  }

  public getAllPlanets = async (request: IAuthorizedRequest, response: Response) => {
    try {
      const userID = parseInt(request.userID, 10);

      const planetList = await this.planetService.getAllPlanetsOfUser(userID, true);

      return response.status(Globals.Statuscode.SUCCESS).json(planetList ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SUCCESS).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  public getAllPlanetsOfUser = async (request: IAuthorizedRequest, response: Response) => {
    try {
      const userID = parseInt(request.params.userID, 10);

      const planetList = await this.planetService.getAllPlanetsOfUser(userID);

      return response.status(Globals.Statuscode.SUCCESS).json(planetList ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SUCCESS).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  public getOwnPlanet = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.params.planetID, 10);

      const planet = await this.planetService.getPlanet(userID, planetID, true);

      return response.status(Globals.Statuscode.SUCCESS).json(planet ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  public getMovement = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.params.planetID, 10);

      const movement = await this.planetService.getMovementOnPlanet(userID, planetID);

      return response.status(Globals.Statuscode.SUCCESS).json(movement ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  public destroyPlanet = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const planetList = await this.planetService.getAllPlanetsOfUser(userID);

      if (planetList.length === 1) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "The last planet cannot be destroyed",
        });
      }

      // TODO: if the deleted planet was the current planet -> set another one as current planet
      await this.planetService.deletePlanet(userID, planetID);

      return response.status(Globals.Statuscode.SUCCESS).json({});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  public renamePlanet = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.planetID) || !InputValidator.isSet(request.body.name)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
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

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);

      planet.name = newName;

      await this.planetService.updatePlanet(planet);

      return response.status(Globals.Statuscode.SUCCESS).json(planet ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  public getPlanetByID = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.params.planetID, 10);

      const planet: Planet = await this.planetService.getPlanet(userID, planetID);

      return response.status(Globals.Statuscode.SUCCESS).json(planet ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };
}
