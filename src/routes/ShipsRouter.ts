import { NextFunction, Response, Router as newRouter } from "express";
import Calculations from "../common/Calculations";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import Logger from "../common/Logger";
import Queue from "../common/Queue";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import IBuildingService from "../interfaces/IBuildingService";
import ICosts from "../interfaces/ICosts";
import IPlanetService from "../interfaces/IPlanetService";
import IShipService from "../interfaces/IShipService";
import Buildings from "../units/Buildings";
import Planet from "../units/Planet";
import QueueItem from "../common/QueueItem";

/**
 * Defines routes for ships-data
 */
export default class ShipsRouter {
  public router = newRouter();

  private planetService: IPlanetService;
  private buildingService: IBuildingService;
  private shipService: IShipService;

  /**
   * Registers the routes and needed services
   * @param container the IoC-container with registered services
   */
  public constructor(container) {
    this.planetService = container.planetService;
    this.buildingService = container.buildingService;
    this.shipService = container.shipService;

    this.router.get("/:planetID", this.getAllShipsOnPlanet);
    this.router.post("/build/", this.buildShips);
  }

  /**
   * Returns a list of all ships on a given planet owned by the authenticated user
   * @param request
   * @param response
   * @param next
   */
  public getAllShipsOnPlanet = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({

          error: "Invalid parameter",

        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.params.planetID, 10);

      const ships = await this.shipService.getShips(userID, planetID);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        error: "Success",
        data: ships,
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        error: "There was an error while handling the request.",

      });
    }
  };

  /**
   * Starts a new build-order on the planet and appends it to the build-queue
   * @param request
   * @param response
   * @param next
   */
  public buildShips = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (
        !InputValidator.isSet(request.body.planetID) ||
        !InputValidator.isValidInt(request.body.planetID) ||
        !InputValidator.isSet(request.body.buildOrder) ||
        !InputValidator.isValidJson(request.body.buildOrder)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({

          error: "Invalid parameter",

        });
      }

      const buildOrders = JSON.parse(request.body.buildOrder);

      // validate build-order
      if (!InputValidator.isValidBuildOrder(buildOrders, Globals.UnitType.SHIP)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({

          error: "Invalid parameter",

        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const queue: Queue = new Queue();

      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const buildings: Buildings = await this.buildingService.getBuildings(planetID);

      if (planet === null) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({

          error: "The player does not own the planet",

        });
      }

      if (planet.b_hangar_plus) {
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
            buildings.nanite_factory,
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

      if (!InputValidator.isSet(planet.b_hangar_queue)) {
        planet.b_hangar_queue = JSON.parse("[]");
        oldBuildOrder = planet.b_hangar_queue;
      } else {
        oldBuildOrder = JSON.parse(planet.b_hangar_queue);
      }

      oldBuildOrder.push(queue);

      planet.b_hangar_queue = JSON.stringify(oldBuildOrder);

      if (planet.b_hangar_start_time === 0) {
        planet.b_hangar_start_time = Math.floor(Date.now() / 1000);
      }

      planet.metal = metal;
      planet.crystal = crystal;
      planet.deuterium = deuterium;

      await this.planetService.updatePlanet(planet);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        error: "Success",
        data: planet,
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        error: "There was an error while handling the request.",

      });
    }
  };
}
