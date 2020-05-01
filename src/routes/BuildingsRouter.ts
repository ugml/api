import { Response, Router } from "express";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import ILogger from "../interfaces/ILogger";
import IBuildingsService from "../interfaces/services/IBuildingsService";
import IPlanetService from "../interfaces/services/IPlanetService";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";

import InvalidParameterException from "../exceptions/InvalidParameterException";
import Exception from "../exceptions/Exception";

/**
 * Defines routes for building-data
 */
export default class BuildingsRouter {
  public router: Router = Router();

  private logger: ILogger;

  private buildingsService: IBuildingsService;
  private planetService: IPlanetService;

  public constructor(container, logger: ILogger) {
    this.buildingsService = container.buildingsService;
    this.planetService = container.planetService;

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
        throw new InvalidParameterException("Invalid parameter");
      }

      const planetID: number = parseInt(request.params.planetID, 10);
      const userID = parseInt(request.userID, 10);

      console.log("called getAllBuildingsOnPlanet in router");

      const result = await this.buildingsService.getBuildingsOnPlanetWithID(planetID, userID);

      return response.status(Globals.Statuscode.SUCCESS).json(result ?? {});
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

  /**
   * Cancels a build-order on a planet
   * @param request
   * @param response
   */
  public cancelBuilding = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.planetID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      console.log("called cancelBuilding in router");

      const result = await this.buildingsService.cancelBuildingOnPlanetWithID(planetID, userID);
      return response.status(Globals.Statuscode.SUCCESS).json(result ?? {});
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

  /**
   * Starts a new build-order
   * @param request
   * @param response
   */
  public startBuilding = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.planetID) || !InputValidator.isValidInt(request.body.buildingID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const buildingID = parseInt(request.body.buildingID, 10);

      if (!InputValidator.isValidBuildingId(buildingID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const result = await this.buildingsService.startBuildingOnPlanet(planetID, buildingID, userID);

      return response.status(Globals.Statuscode.SUCCESS).json(result ?? {});
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

  public demolishBuilding = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.planetID) || !InputValidator.isValidInt(request.body.buildingID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);
      const buildingID = parseInt(request.body.buildingID, 10);

      if (!InputValidator.isValidBuildingId(buildingID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const planet = await this.buildingsService.demolishBuildingOnPlanet(planetID, buildingID, userID);

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
