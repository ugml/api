import IDefenseService from "../interfaces/services/IDefenseService";
import { inject, injectable } from "inversify";
import Defenses from "../units/Defenses";
import TYPES from "../ioc/types";
import IDefenseRepository from "../interfaces/repositories/IDefenseRepository";
import IPlanetService from "../interfaces/services/IPlanetService";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import IPlanetRepository from "../interfaces/repositories/IPlanetRepository";

import ApiException from "../exceptions/ApiException";
import Buildings from "../units/Buildings";
import Planet from "../units/Planet";
import Calculations from "../common/Calculations";
import Queue from "../common/Queue";
import IUnitCosts from "../interfaces/IUnitCosts";
import QueueItem from "../common/QueueItem";
import BuildDefenseRequest from "../entities/requests/BuildDefenseRequest";
import IBuildingRepository from "../interfaces/repositories/IBuildingRepository";

/**
 * This class defines a service to interact with the defenses-table in the database
 */
@injectable()
export default class DefenseService implements IDefenseService {
  @inject(TYPES.IDefenseRepository) private defenseRepository: IDefenseRepository;
  @inject(TYPES.IPlanetRepository) private planetRepository: IPlanetRepository;
  @inject(TYPES.IBuildingRepository) private buildingRepository: IBuildingRepository;
  @inject(TYPES.IPlanetService) private planetService: IPlanetService;

  public async getDefenses(userID: number, planetID: number): Promise<Defenses> {
    if (!(await this.planetRepository.exists(planetID))) {
      throw new ApiException("Planet does not exist");
    }

    if (!(await this.planetService.checkUserOwnsPlanet(userID, planetID))) {
      throw new UnauthorizedException("User does not own the planet");
    }

    return await this.defenseRepository.getById(planetID);
  }

  public async processBuildOrder(request: BuildDefenseRequest, userID: number): Promise<Planet> {
    if (!(await this.planetRepository.exists(request.planetID))) {
      throw new ApiException("Planet does not exist");
    }

    const planet: Planet = await this.planetRepository.getById(request.planetID);

    if (planet.ownerID !== userID) {
      throw new UnauthorizedException("User does not own the planet");
    }

    const buildings: Buildings = await this.buildingRepository.getById(request.planetID);
    const defenses: Defenses = await this.defenseRepository.getById(request.planetID);

    if (planet.isUpgradingHangar()) {
      throw new ApiException("Shipyard is currently upgrading");
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

    // TODO: put this into a separate function
    for (const buildOrder of request.buildOrder) {
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

    await this.planetRepository.save(planet);

    return planet;
  }
}
