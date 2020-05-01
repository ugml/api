import { Response, Router } from "express";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import Defenses from "../units/Defenses";
import ILogger from "../interfaces/ILogger";
import InvalidParameterException from "../exceptions/InvalidParameterException";
import IDefenseService from "../interfaces/services/IDefenseService";
import Exception from "../exceptions/Exception";

/**
 * Defines routes for defense-data
 */
export default class DefenseRouter {
  public router: Router = Router();

  private logger: ILogger;

  private defenseService: IDefenseService;

  public constructor(container, logger: ILogger) {
    this.defenseService = container.defenseService;

    this.router.get("/:planetID", this.getAllDefensesOnPlanet);
    this.router.post("/build/", this.buildDefense);

    this.logger = logger;
  }

  public getAllDefensesOnPlanet = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.params.planetID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const planetID = parseInt(request.params.planetID, 10);
      const userID = parseInt(request.userID, 10);

      const defenses: Defenses = await this.defenseService.getAllDefensesOnPlanet(planetID, userID);

      return response.status(Globals.Statuscode.SUCCESS).json(defenses ?? {});
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
   * Appends a new build-order to the current build-queue
   * @param request
   * @param response
   */
  public buildDefense = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.planetID) || !InputValidator.isValidJson(request.body.buildOrder)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);
      const buildOrders = JSON.parse(request.body.buildOrder);

      if (!InputValidator.isValidBuildOrder(buildOrders, Globals.UnitType.DEFENSE)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const result = await this.defenseService.buildDefensesOnPlanet(planetID, userID, buildOrders);

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
}
