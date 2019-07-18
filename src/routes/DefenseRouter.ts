import "reflect-metadata";
import { NextFunction, Response, Router } from "express";
import { inject } from "inversify";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { QueueItem } from "../common/QueueItem";
import { Units, UnitType } from "../common/Units";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { ICosts } from "../interfaces/ICosts";
import { Logger } from "../common/Logger";
import { TYPES } from "../types";
import { Buildings } from "../units/Buildings";
import { Defenses } from "../units/Defenses";
import { Planet } from "../units/Planet";

const units = new Units();

export class DefenseRouter {
  public router: Router;

  @inject(TYPES.IPlanetService) private planetService;
  @inject(TYPES.IBuildingService) private buildingService;
  @inject(TYPES.IDefenseService) private defenseService;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.init();
  }

  public async getAllDefensesOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
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

      // return the result
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
  }

  public async buildDefense(request: IAuthorizedRequest, response: Response, next: NextFunction) {
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

      const queueItem: QueueItem = new QueueItem();

      queueItem.setPlanetID(planetID);

      // validate build-order
      if (!units.isValidBuildOrder(buildOrders, UnitType.DEFENSE)) {
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

      if (planet.b_hangar_plus) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Shipyard is currently upgrading.",
          data: {},
        });
      }

      let metal = planet.metal;
      let crystal = planet.crystal;
      let deuterium = planet.deuterium;

      let stopProcessing = false;
      let buildTime = 0;
      let freeSiloSlots: number =
        buildings.missile_silo * 10 - defenses.anti_ballistic_missile - defenses.interplanetary_missile * 2;

      for (const item in buildOrders) {
        if (buildOrders.hasOwnProperty(item)) {
          let count: number = buildOrders[item];
          const cost: ICosts = units.getCosts(parseInt(item, 10), 1, UnitType.DEFENSE);

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
            units.getBuildTimeInSeconds(cost.metal, cost.crystal, buildings.shipyard, buildings.nanite_factory) *
            Math.floor(count);

          queueItem.addToQueue(item, Math.floor(count));

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

      queueItem.setTimeRemaining(buildTime);
      queueItem.setLastUpdateTime(Math.floor(Date.now() / 1000));

      let oldBuildOrder;

      if (!InputValidator.isSet(planet.b_hangar_queue)) {
        planet.b_hangar_queue = JSON.parse("[]");
        oldBuildOrder = planet.b_hangar_queue;
      } else {
        oldBuildOrder = JSON.parse(planet.b_hangar_queue);
      }

      oldBuildOrder.push(queueItem);

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
    this.router.get("/:planetID", this.getAllDefensesOnPlanet);
    this.router.post("/build/", this.buildDefense);
  }
}

const defenseRoutes = new DefenseRouter();
defenseRoutes.init();

export default defenseRoutes.router;
