import { IRouter, NextFunction, Response, Router as newRouter, Router } from "express";
import Calculations from "../common/Calculations";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import Queue from "../common/Queue";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import IBuildingService from "../interfaces/IBuildingService";
import ICosts from "../interfaces/ICosts";
import Logger from "../common/Logger";
import IDefenseService from "../interfaces/IDefenseService";
import IPlanetService from "../interfaces/IPlanetService";
import Buildings from "../units/Buildings";
import Defenses from "../units/Defenses";
import Planet from "../units/Planet";

/**
 * Defines routes for defense-data
 */
export default class DefenseRouter {
  public router: IRouter = newRouter();

  private planetService: IPlanetService;
  private buildingService: IBuildingService;
  private defenseService: IDefenseService;

  /**
   * Registers the routes and needed services
   * @param container the IoC-container with registered services
   */
  public constructor(container) {
    this.planetService = container.planetService;
    this.buildingService = container.buildingService;
    this.defenseService = container.defenseService;

    this.router.get("/:planetID", this.getAllDefensesOnPlanet);
    this.router.post("/build/", this.buildDefense);
  }

  /**
   * Returns a list of defenses on a given planet
   * @param request
   * @param response
   * @param next
   */
  public getAllDefensesOnPlanet = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const planetID = parseInt(request.params.planetID, 10);
      const userID = parseInt(request.userID, 10);

      const defenses: Defenses = await this.defenseService.getDefenses(userID, planetID);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: defenses || {},
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
   * Append a new build-order to the current build-queue
   * @param request
   * @param response
   * @param next
   */
  public buildDefense = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (
        !InputValidator.isSet(request.body.planetID) ||
        !InputValidator.isValidInt(request.body.planetID) ||
        !InputValidator.isSet(request.body.buildOrder) ||
        !InputValidator.isValidJson(request.body.buildOrder)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const buildOrders = JSON.parse(request.body.buildOrder);

      const queue: Queue = new Queue();

      queue.setPlanetID(planetID);

      // validate build-order
      if (!InputValidator.isValidBuildOrder(buildOrders, Globals.UnitType.DEFENSE)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const buildings: Buildings = await this.buildingService.getBuildings(planetID);
      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const defenses: Defenses = await this.defenseService.getDefenses(userID, planetID);

      if (!InputValidator.isSet(buildings) || !InputValidator.isSet(planet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "The player does not own the planet",
          data: {},
        });
      }

      if (planet.isUpgradingHangar()) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Shipyard is currently upgrading",
          data: {},
        });
      }

      let metal = planet.metal;
      let crystal = planet.crystal;
      let deuterium = planet.deuterium;

      let stopProcessing = false;
      let buildTime = 0;

      let freeSiloSlots: number = Calculations.calculateFreeMissileSlots(
        buildings.missile_silo,
        defenses.anti_ballistic_missile,
        defenses.interplanetary_missile,
      );

      // TODO: put this into a seperate function
      for (const item in buildOrders) {
        if (buildOrders.hasOwnProperty(item)) {
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

          // check free slots in silo
          if (item === "309") {
            // can't build any more rockets
            if (freeSiloSlots === 0) {
              buildOrders[item] = 0;
            } else {
              buildOrders[item] = Math.min(freeSiloSlots, buildOrders[item]);
              freeSiloSlots -= buildOrders[item];
            }
          }

          if (item === "310") {
            // can't build any more rockets
            if (freeSiloSlots === 0) {
              buildOrders[item] = 0;
            } else {
              buildOrders[item] = Math.floor(freeSiloSlots / 2) * buildOrders[item];
              freeSiloSlots -= buildOrders[item];
            }
          }

          // build time in seconds
          buildTime +=
            Calculations.calculateBuildTimeInSeconds(
              cost.metal,
              cost.crystal,
              buildings.shipyard,
              buildings.nanite_factory,
            ) * Math.floor(count);

          queue.getQueue().set(item, Math.floor(count));

          metal -= cost.metal * count;
          crystal -= cost.crystal * count;
          deuterium -= cost.deuterium * count;

          if (stopProcessing) {
            break;
          }
        } else {
          // TODO: throw a meaningful error
          throw Error();
        }
      }

      queue.setTimeRemaining(buildTime);
      queue.setLastUpdateTime(Math.floor(Date.now() / 1000));

      let oldBuildOrder;

      if (!planet.isBuildingUnits()) {
        planet.b_hangar_queue = JSON.parse("[]");
        oldBuildOrder = planet.b_hangar_queue;
        planet.b_hangar_start_time = Math.floor(Date.now() / 1000);
      } else {
        oldBuildOrder = JSON.parse(planet.b_hangar_queue);
      }

      oldBuildOrder.push(queue);

      planet.b_hangar_queue = JSON.stringify(oldBuildOrder);

      planet.metal = metal;
      planet.crystal = crystal;
      planet.deuterium = deuterium;

      await this.planetService.updatePlanet(planet);

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
  };
}
