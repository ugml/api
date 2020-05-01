import { Response, Router } from "express";
import Calculations from "../common/Calculations";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import Queue from "../common/Queue";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import ICosts from "../interfaces/ICosts";
import Buildings from "../units/Buildings";
import Planet from "../units/Planet";
import QueueItem from "../common/QueueItem";
import ILogger from "../interfaces/ILogger";
import IPlanetDataAccess from "../interfaces/dataAccess/IPlanetDataAccess";
import IBuildingsDataAccess from "../interfaces/dataAccess/IBuildingsDataAccess";
import IShipDataAccess from "../interfaces/dataAccess/IShipDataAccess";
import PermissionException from "../exceptions/PermissionException";
import InvalidParameterException from "../exceptions/InvalidParameterException";
import UnitDoesNotExistException from "../exceptions/UnitDoesNotExistException";
import Exception from "../exceptions/Exception";

/**
 * Defines routes for ships-data
 */
export default class ShipsRouter {
  public router: Router = Router();
  private logger: ILogger;
  private planetDataAccess: IPlanetDataAccess;
  private buildingsDataAccess: IBuildingsDataAccess;
  private shipDataAccess: IShipDataAccess;

  public constructor(container, logger: ILogger) {
    this.planetDataAccess = container.planetDataAccess;
    this.buildingsDataAccess = container.buildingsDataAccess;
    this.shipDataAccess = container.shipDataAccess;

    this.router.get("/:planetID", this.getAllShipsOnPlanet);
    this.router.post("/build/", this.buildShips);

    this.logger = logger;
  }

  public getAllShipsOnPlanet = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.params.planetID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.params.planetID, 10);

      const ships = await this.shipDataAccess.getShips(userID, planetID);

      return response.status(Globals.Statuscode.SUCCESS).json(ships ?? {});
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
   * Starts a new build-order on the planet and appends it to the build-queue
   * @param request
   * @param response
   */
  public buildShips = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (
        !InputValidator.isSet(request.body.planetID) ||
        !InputValidator.isValidInt(request.body.planetID) ||
        !InputValidator.isSet(request.body.buildOrder) ||
        !InputValidator.isValidJson(request.body.buildOrder)
      ) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const buildOrders = JSON.parse(request.body.buildOrder);

      // validate build-order
      if (!InputValidator.isValidBuildOrder(buildOrders, Globals.UnitType.SHIP)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const queue: Queue = new Queue();

      const planet: Planet = await this.planetDataAccess.getPlanetByIDWithFullInformation(planetID);

      if (!InputValidator.isSet(planet)) {
        throw new UnitDoesNotExistException("Planet does not exist");
      }

      if (planet.ownerID !== userID) {
        throw new PermissionException("User does not own the planet");
      }

      const buildings: Buildings = await this.buildingsDataAccess.getBuildings(planetID);

      if (planet.bHangarPlus) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Shipyard is currently upgrading",
        });
      }

      let metal = planet.metal;
      let crystal = planet.crystal;
      let deuterium = planet.deuterium;

      let stopProcessing = false;
      let buildTime = 0;

      // TODO: put into seperate funciton (also reference this in defense-router)
      for (const item in buildOrders) {
        if (!buildOrders.hasOwnProperty(item)) {
          continue;
        }

        let count: number = buildOrders[item];
        const cost: ICosts = Calculations.getCosts(parseInt(item, 10), 1);

        // if the user has not enough ressources to fullfill the complete build-order
        if (metal < cost.metal * count || crystal < cost.crystal * count || deuterium < cost.deuterium * count) {
          let tempCount: number;

          if (cost.metal > 0) {
            tempCount = metal / cost.metal;

            if (tempCount < count) {
              count = tempCount;
            }
          }

          if (cost.crystal > 0) {
            tempCount = crystal / cost.crystal;

            if (tempCount < count) {
              count = tempCount;
            }
          }

          if (cost.deuterium > 0) {
            tempCount = deuterium / cost.deuterium;

            if (tempCount < count) {
              count = tempCount;
            }
          }

          // no need to further process the queue
          stopProcessing = true;
        }

        // build time in seconds
        buildTime +=
          Calculations.calculateBuildTimeInSeconds(
            cost.metal,
            cost.crystal,
            buildings.shipyard,
            buildings.naniteFactory,
          ) * Math.floor(count);

        queue.getQueue().push(new QueueItem(parseInt(item, 10), Math.floor(count)));

        metal -= cost.metal * count;
        crystal -= cost.crystal * count;
        deuterium -= cost.deuterium * count;

        if (stopProcessing) {
          break;
        }
      }

      queue.setTimeRemaining(buildTime);
      queue.setLastUpdateTime(Math.floor(Date.now() / 1000));

      let oldBuildOrder;

      if (!InputValidator.isSet(planet.bHangarQueue)) {
        planet.bHangarQueue = JSON.parse("[]");
        oldBuildOrder = planet.bHangarQueue;
      } else {
        oldBuildOrder = JSON.parse(planet.bHangarQueue);
      }

      oldBuildOrder.push(queue);

      planet.bHangarQueue = JSON.stringify(oldBuildOrder);

      if (planet.bHangarStartTime === 0) {
        planet.bHangarStartTime = Math.floor(Date.now() / 1000);
      }

      planet.metal = metal;
      planet.crystal = crystal;
      planet.deuterium = deuterium;

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
}
