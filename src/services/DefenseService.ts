import IDefenseService from "../interfaces/services/IDefenseService";
import Defenses from "../units/Defenses";
import IDefenseDataAccess from "../interfaces/dataAccess/IDefenseDataAccess";
import Planet from "../units/Planet";
import Buildings from "../units/Buildings";
import InputValidator from "../common/InputValidator";
import PermissionException from "../exceptions/PermissionException";
import UnitInUseException from "../exceptions/UnitInUseException";
import Queue from "../common/Queue";
import Calculations from "../common/Calculations";
import ICosts from "../interfaces/ICosts";

import QueueItem from "../common/QueueItem";
import IBuildingsDataAccess from "../interfaces/dataAccess/IBuildingsDataAccess";
import IPlanetDataAccess from "../interfaces/dataAccess/IPlanetDataAccess";
import ITimeService from "../interfaces/services/ITimeService";
import { Globals } from "../common/Globals";

export default class DefenseService implements IDefenseService {
  private defenseDataAccess: IDefenseDataAccess;
  private buildingsDataAccess: IBuildingsDataAccess;
  private planetDataAccess: IPlanetDataAccess;
  private timeService: ITimeService;

  constructor(container) {
    this.buildingsDataAccess = container.buildingsDataAccess;
    this.defenseDataAccess = container.defenseDataAccess;
    this.planetDataAccess = container.planetDataAccess;
    this.timeService = container.timeService;
  }

  public async getAllDefensesOnPlanet(planetID: number, userID: number): Promise<Defenses> {
    return await this.defenseDataAccess.getDefenses(planetID, userID);
  }

  public async buildDefensesOnPlanet(planetID: number, userID: number, buildOrders: object): Promise<Planet> {
    const buildingsOnPlanet: Buildings = await this.buildingsDataAccess.getBuildings(planetID);
    const planet: Planet = await this.planetDataAccess.getPlanetByIDWithFullInformation(planetID);

    if (!InputValidator.isSet(buildingsOnPlanet) || !InputValidator.isSet(planet)) {
      throw new PermissionException("The player does not own the planet");
    }

    if (planet.isUpgradingHangar()) {
      throw new UnitInUseException("Shipyard is currently upgrading");
    }

    let stopProcessing = false;
    let buildTime = 0;

    const defenses: Defenses = await this.defenseDataAccess.getDefenses(planetID, userID);

    let freeSiloSlots: number = Calculations.calculateFreeMissileSlots(
      buildingsOnPlanet.missileSilo,
      defenses.antiBallisticMissile,
      defenses.interplanetaryMissile,
    );

    const queue: Queue = new Queue();

    // TODO: put this into a seperate service
    for (const buildOrder in buildOrders) {
      const unitID = parseInt(buildOrder, 10);

      if (buildOrders.hasOwnProperty(buildOrder)) {
        let maxBuildableAmount: number = buildOrders[buildOrder];
        const costs: ICosts = Calculations.getCosts(unitID, 1);

        if (
          planet.metal < costs.metal * maxBuildableAmount ||
          planet.crystal < costs.crystal * maxBuildableAmount ||
          planet.deuterium < costs.deuterium * maxBuildableAmount
        ) {
          maxBuildableAmount = planet.getMaxBuildableAmountOfUnit(costs, maxBuildableAmount);
          stopProcessing = true;
        }

        // TODO: does a INTERPLANETARY_MISSILE take up two spaces?
        if (unitID === Globals.Defenses.ANTI_BALLISTIC_MISSILE || unitID === Globals.Defenses.INTERPLANETARY_MISSILE) {
          // can't build any more rockets
          const maxBuildableRockets = this.getMaxBuildableRockets(
            freeSiloSlots,
            buildOrders[buildOrder],
            maxBuildableAmount,
          );
          freeSiloSlots -= maxBuildableRockets;
          maxBuildableAmount = maxBuildableRockets;
        }

        costs.metal = costs.metal * maxBuildableAmount;
        costs.crystal = costs.crystal * maxBuildableAmount;
        costs.deuterium = costs.deuterium * maxBuildableAmount;

        buildTime +=
          (await this.timeService.calculateBuildTime(unitID, 1, buildingsOnPlanet)) * Math.floor(maxBuildableAmount);

        queue.getQueue().push(new QueueItem(parseInt(buildOrder, 10), Math.floor(maxBuildableAmount)));
        planet.substractCosts(costs);

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

    planet.setBuildOrder(queue);

    return await this.planetDataAccess.updatePlanet(planet);
  }

  private getMaxBuildableRockets(freeSiloSlots: number, numberRocketsToBuild: number, maxAffordableAmount: number) {
    if (freeSiloSlots === 0) {
      return 0;
    }

    return Math.min(Math.min(freeSiloSlots, numberRocketsToBuild), maxAffordableAmount);
  }
}
