import Calculations from "../common/Calculations";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import Queue from "../common/Queue";

import IBuildingService from "../interfaces/services/IBuildingService";
import IUnitCosts from "../interfaces/IUnitCosts";
import IDefenseService from "../interfaces/services/IDefenseService";
import IPlanetService from "../interfaces/services/IPlanetService";
import Buildings from "../units/Buildings";
import Defenses from "../units/Defenses";
import Planet from "../units/Planet";
import QueueItem from "../common/QueueItem";
import ILogger from "../interfaces/ILogger";
import {Body, Controller, Get, Post, Request, Route, Security, SuccessResponse, Tags} from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";

import BuildDefenseRequest from "../entities/requests/BuildDefenseRequest";

@Tags("Defenses")
@Route("defenses")
@provide(DefenseRouter)
export class DefenseRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IBuildingService) private buildingService: IBuildingService;
  @inject(TYPES.IPlanetService) private planetService: IPlanetService;
  @inject(TYPES.IDefenseService) private defenseService: IDefenseService;

  @Security("jwt")
  @Get("/{planetID}")
  @SuccessResponse(Globals.StatusCodes.SUCCESS)
  public async getAllDefensesOnPlanet(@Request() headers, planetID: number) {
    try {
      this.setStatus(Globals.StatusCodes.SUCCESS);

      return await this.defenseService.getDefenses(headers.user.userID, planetID);
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return {
        error: "There was an error while handling the request.",
      };
    }
  }

  @Security("jwt")
  @Post("/build")
  @SuccessResponse(Globals.StatusCodes.SUCCESS)
  public async buildDefense(@Request() headers, @Body() request: BuildDefenseRequest) {
    try {
      const userID = headers.user.userID;
      const planetID = request.planetID;

      const buildOrders = request.buildOrder;

      if (!InputValidator.isValidBuildOrder(buildOrders, Globals.UnitType.DEFENSE)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);
        return {
          error: "Invalid parameter",
        };
      }

      const buildings: Buildings = await this.buildingService.getBuildings(planetID);
      const planet: Planet = await this.planetService.getPlanet(userID, planetID, true);
      const defenses: Defenses = await this.defenseService.getDefenses(userID, planetID);

      if (!InputValidator.isSet(buildings) || !InputValidator.isSet(planet)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);
        return {
          error: "The player does not own the planet",
        };
      }

      if (planet.isUpgradingHangar()) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);
        return {
          error: "Shipyard is currently upgrading",
        };
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

      const queue: Queue = new Queue();

      // TODO: put this into a seperate function
      for (const buildOrder of buildOrders) {
        let count = buildOrder.amount;

        const cost: IUnitCosts = Calculations.getCosts(buildOrder.unitID, 1);

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
        if (buildOrder.unitID === 309) {
          // can't build any more rockets
          if (freeSiloSlots === 0) {
            buildOrder.amount = 0;
          } else {
            buildOrder.amount = Math.min(freeSiloSlots, buildOrder.amount);
            freeSiloSlots -= buildOrder.amount;
          }
        }

        if (buildOrder.unitID === 310) {
          // can't build any more rockets
          if (freeSiloSlots === 0) {
            buildOrder.amount = 0;
          } else {
            buildOrder.amount = Math.floor(freeSiloSlots / 2) * buildOrder.amount;
            freeSiloSlots -= buildOrder.amount;
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

        queue.getQueue().push(new QueueItem(buildOrder.unitID, Math.floor(count)));

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

      this.setStatus(Globals.StatusCodes.SUCCESS);

      return planet;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return {
        error: "There was an error while handling the request.",
      };
    }
  }
}
