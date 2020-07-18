import { Response, Router } from "express";
import Calculations from "../common/Calculations";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import Queue from "../common/Queue";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import IBuildingService from "../interfaces/services/IBuildingService";
import ICosts from "../interfaces/ICosts";
import IDefenseService from "../interfaces/services/IDefenseService";
import IPlanetService from "../interfaces/services/IPlanetService";
import Buildings from "../units/Buildings";
import Defenses from "../units/Defenses";
import Planet from "../units/Planet";
import QueueItem from "../common/QueueItem";
import ILogger from "../interfaces/ILogger";

/**
 * Defines routes for defense-data
 */
export default class DefenseRouter {
  public router: Router = Router();

  private logger: ILogger;

  private planetService: IPlanetService;
  private buildingService: IBuildingService;
  private defenseService: IDefenseService;

  /**
   * Registers the routes and needed services
   * @param container the IoC-container with registered services
   * @param logger Instance of an ILogger-object
   */
  public constructor(container, logger: ILogger) {
    this.planetService = container.planetService;
    this.buildingService = container.buildingService;
    this.defenseService = container.defenseService;

    this.router.get("/:planetID", this.getAllDefensesOnPlanet);
    this.router.post("/build/", this.buildDefense);

    this.logger = logger;
  }

  /**
   * Returns a list of defenses on a given planet
   * @param request
   * @param response
   * @param next
   */
  public getAllDefensesOnPlanet = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.StatusCodes.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const planetID = parseInt(request.params.planetID, 10);
      const userID = parseInt(request.userID, 10);

      const defenses: Defenses = await this.defenseService.getDefenses(userID, planetID);

      return response.status(Globals.StatusCodes.SUCCESS).json(defenses ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.StatusCodes.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  /**
   * Append a new build-order to the current build-queue
   * @param request
   * @param response
   * @param next
   */
  public buildDefense = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (
        !InputValidator.isSet(request.body.planetID) ||
        !InputValidator.isValidInt(request.body.planetID) ||
        !InputValidator.isSet(request.body.buildOrder) ||
        !InputValidator.isValidJson(request.body.buildOrder)
      ) {
        return response.status(Globals.StatusCodes.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const buildOrders = JSON.parse(request.body.buildOrder);

      const queue: Queue = new Queue();

      // validate build-order
      if (!InputValidator.isValidBuildOrder(buildOrders, Globals.UnitType.DEFENSE)) {
        return response.status(Globals.StatusCodes.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const buildings: Buildings = await this.buildingService.getBuildings(planetID);
      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const defenses: Defenses = await this.defenseService.getDefenses(userID, planetID);

      if (!InputValidator.isSet(buildings) || !InputValidator.isSet(planet)) {
        return response.status(Globals.StatusCodes.BAD_REQUEST).json({
          error: "The player does not own the planet",
        });
      }

      if (planet.isUpgradingHangar()) {
        return response.status(Globals.StatusCodes.BAD_REQUEST).json({
          error: "Shipyard is currently upgrading",
        });
      }

      let metal = planet.metal;
      let crystal = planet.crystal;
      let deuterium = planet.deuterium;

      let stopProcessing = false;
      let buildTime = 0;

      let freeSiloSlots: number = Calculations.calculateFreeMissileSlots(
        buildings.missileSilo,
        defenses.antiBallisticMissile,
        defenses.interplanetaryMissile,
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
              buildings.naniteFactory,
            ) * Math.floor(count);

          queue.getQueue().push(new QueueItem(parseInt(item, 10), Math.floor(count)));

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
        planet.bHangarQueue = JSON.parse("[]");
        oldBuildOrder = planet.bHangarQueue;
        planet.bHangarStartTime = Math.floor(Date.now() / 1000);
      } else {
        oldBuildOrder = JSON.parse(planet.bHangarQueue);
      }

      oldBuildOrder.push(queue);

      planet.bHangarQueue = JSON.stringify(oldBuildOrder);

      planet.metal = metal;
      planet.crystal = crystal;
      planet.deuterium = deuterium;

      await this.planetService.updatePlanet(planet);

      return response.status(Globals.StatusCodes.SUCCESS).json(planet ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.StatusCodes.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };
}
