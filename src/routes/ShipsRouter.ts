import Calculations from "../common/Calculations";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import Queue from "../common/Queue";

import IBuildingService from "../interfaces/services/IBuildingService";
import IUnitCosts from "../interfaces/IUnitCosts";
import IPlanetService from "../interfaces/services/IPlanetService";
import IShipService from "../interfaces/services/IShipService";
import Buildings from "../units/Buildings";
import Planet from "../units/Planet";
import QueueItem from "../common/QueueItem";
import ILogger from "../interfaces/ILogger";
import { Body, Controller, Get, Post, Request, Route, Security, Tags } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";

import BuildShipsRequest from "../entities/requests/BuildShipsRequest";
import FailureResponse from "../entities/responses/FailureResponse";

@Tags("Ships")
@Route("ships")
@provide(ShipsRouter)
export class ShipsRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IBuildingService) private buildingService: IBuildingService;
  @inject(TYPES.IPlanetService) private planetService: IPlanetService;
  @inject(TYPES.IShipService) private shipService: IShipService;

  @Security("jwt")
  @Get("/{planetID}")
  public async getAllShipsOnPlanet(@Request() request, planetID: number) {
    try {
      return await this.shipService.getShips(request.user.userID, planetID);
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }

  @Security("jwt")
  @Post("/build")
  public async buildShips(@Request() headers, @Body() request: BuildShipsRequest) {
    try {
      if (!InputValidator.isValidBuildOrder(request.buildOrder, Globals.UnitType.SHIP)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return new FailureResponse("Invalid parameter");
      }

      const queue: Queue = new Queue();

      const planet: Planet = await this.planetService.getPlanet(headers.user.userID, request.planetID, true);
      const buildings: Buildings = await this.buildingService.getBuildings(request.planetID);

      if (planet === null) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return new FailureResponse("The player does not own the planet");
      }

      if (planet.bHangarPlus) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);

        return new FailureResponse("Shipyard is currently upgrading");
      }

      let metal = planet.metal;
      let crystal = planet.crystal;
      let deuterium = planet.deuterium;

      let stopProcessing = false;
      let buildTime = 0;

      // TODO: put into seperate funciton (also reference this in defense-router)
      for (const buildOrder of request.buildOrder) {
        const cost: IUnitCosts = Calculations.getCosts(buildOrder.unitID, 1);

        // if the user has not enough ressources to fullfill the complete build-order
        if (
          metal < cost.metal * buildOrder.amount ||
          crystal < cost.crystal * buildOrder.amount ||
          deuterium < cost.deuterium * buildOrder.amount
        ) {
          let tempCount: number;

          if (cost.metal > 0) {
            tempCount = metal / cost.metal;

            if (tempCount < buildOrder.amount) {
              buildOrder.amount = tempCount;
            }
          }

          if (cost.crystal > 0) {
            tempCount = crystal / cost.crystal;

            if (tempCount < buildOrder.amount) {
              buildOrder.amount = tempCount;
            }
          }

          if (cost.deuterium > 0) {
            tempCount = deuterium / cost.deuterium;

            if (tempCount < buildOrder.amount) {
              buildOrder.amount = tempCount;
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
          ) * Math.floor(buildOrder.amount);

        queue.getQueue().push(new QueueItem(buildOrder.unitID, Math.floor(buildOrder.amount)));

        metal -= cost.metal * buildOrder.amount;
        crystal -= cost.crystal * buildOrder.amount;
        deuterium -= cost.deuterium * buildOrder.amount;

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

      await this.planetService.updatePlanet(planet);

      return planet;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }
}
