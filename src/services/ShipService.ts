import IShipService from "../interfaces/services/IShipService";

import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import IPlanetRepository from "../interfaces/repositories/IPlanetRepository";
import IShipsRepository from "../interfaces/repositories/IShipsRepository";
import ApiException from "../exceptions/ApiException";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import IPlanetService from "../interfaces/services/IPlanetService";
import BuildShipsRequest from "../entities/requests/BuildShipsRequest";
import Queue from "../common/Queue";
import Planet from "../units/Planet";
import Buildings from "../units/Buildings";
import IUnitCosts from "../interfaces/IUnitCosts";
import Calculations from "../common/Calculations";
import QueueItem from "../common/QueueItem";
import InputValidator from "../common/InputValidator";

import IBuildingRepository from "../interfaces/repositories/IBuildingRepository";
import NonExistingEntityException from "../exceptions/NonExistingEntityException";

@injectable()
export default class ShipService implements IShipService {
  @inject(TYPES.IShipsRepository) private shipsRepository: IShipsRepository;
  @inject(TYPES.IPlanetRepository) private planetRepository: IPlanetRepository;
  @inject(TYPES.IPlanetService) private planetService: IPlanetService;
  @inject(TYPES.IBuildingRepository) private buildingRepository: IBuildingRepository;

  public async getAll(userID: number, planetID: number) {
    if (!(await this.planetRepository.exists(planetID))) {
      throw new NonExistingEntityException("Planet does not exist");
    }

    if (!(await this.planetService.checkOwnership(userID, planetID))) {
      throw new UnauthorizedException("User does not own the planet");
    }

    return await this.shipsRepository.getById(planetID);
  }

  public async processBuildOrder(request: BuildShipsRequest, userID: number): Promise<Planet> {
    const queue: Queue = new Queue();

    const planet: Planet = await this.planetRepository.getById(request.planetID);

    if (!InputValidator.isSet(planet)) {
      throw new NonExistingEntityException("Planet does not exist");
    }

    const buildings: Buildings = await this.buildingRepository.getById(request.planetID);

    if (planet.ownerID !== userID) {
      throw new UnauthorizedException("The player does not own the planet");
    }

    if (planet.isUpgradingHangar()) {
      throw new ApiException("Shipyard is currently upgrading");
    }

    let metal = planet.metal;
    let crystal = planet.crystal;
    let deuterium = planet.deuterium;

    let stopProcessing = false;
    let buildTimeInSeconds = 0;

    // TODO: put into separate function (also reference this in defense-router)
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

      buildTimeInSeconds +=
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

    queue.setTimeRemaining(buildTimeInSeconds);
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

    await this.planetRepository.save(planet);

    return planet;
  }
}
