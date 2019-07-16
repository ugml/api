import { NextFunction, Response, Router } from "express";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { Logger } from "../common/Logger";
import { PlanetService } from "../services/PlanetService";
import { Planet } from "../units/Planet";

export class PlanetsRouter {
  public router: Router;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.init();
  }

  public async getAllPlanets(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      const userID = parseInt(request.userID, 10);

      const planetList = await PlanetService.getAllPlanetsOfUser(userID, true);

      // return the result
      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: planetList,
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  }

  public async getAllPlanetsOfUser(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      const userID = parseInt(request.params.userID, 10);

      const planetList = await PlanetService.getAllPlanetsOfUser(userID);

      // return the result
      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: planetList,
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  }

  public async getOwnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.params.planetID, 10);

      const planet = await PlanetService.getPlanet(userID, planetID, true);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: planet,
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

  public async getMovement(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.params.planetID, 10);

      const movement = await PlanetService.getMovementOnPlanet(userID, planetID);

      // return the result
      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: movement,
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

  public async destroyPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.body.planetID) || !InputValidator.isValidInt(request.body.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const planetList = await PlanetService.getAllPlanetsOfUser(userID);

      if (planetList.length === 1) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "The last planet cannot be destroyed.",
          data: {},
        });
      }

      // TODO: if the deleted planet was the current planet -> set another one as current planet
      await PlanetService.deletePlanet(userID, planetID);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "The planet was deleted.",
        data: {},
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

  public async renamePlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      // validate parameters
      if (
        !InputValidator.isSet(request.body.planetID) ||
        !InputValidator.isValidInt(request.body.planetID) ||
        !InputValidator.isSet(request.body.name)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const newName: string = InputValidator.sanitizeString(request.body.name);

      // TODO: check max-length
      if (newName.length <= 4) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "New name is too short. Minimum length is 4 characters.",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const planet: Planet = await PlanetService.getPlanet(userID, planetID);

      planet.name = newName;

      await PlanetService.updatePlanet(planet);

      // return the result
      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: planet,
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

  /**
   * GET planet by ID
   */
  public async getPlanetByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.params.planetID, 10);

      const planet: Planet = await PlanetService.getPlanet(userID, planetID);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: planet,
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

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  public init() {
    this.router.get("/movement/:planetID", this.getMovement);
    this.router.post("/destroy/", this.destroyPlanet);
    this.router.post("/rename/", this.renamePlanet);
    this.router.get("/:planetID", this.getPlanetByID);
  }
}

const playerRoutes = new PlanetsRouter();
playerRoutes.init();

export default playerRoutes.router;
