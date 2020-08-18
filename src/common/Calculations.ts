import ICoordinates from "../interfaces/ICoordinates";
import IUnitCosts from "../interfaces/IUnitCosts";
import IPricelist from "../interfaces/IPricelist";
import IShipUnits from "../interfaces/IShipUnits";
import Config from "./Config";
import InputValidator from "./InputValidator";

export default class Calculations {
  public static calculateBuildTimeInSeconds(
    metalCosts: number,
    crystalCosts: number,
    robotFactoryLevel: number,
    naniteFactoryLevel: number,
  ): number {
    return Math.round(
      ((metalCosts + crystalCosts) /
        (2500 * (1 + robotFactoryLevel) * 2 ** naniteFactoryLevel * Config.getGameConfig().server.speed)) *
        3600,
    );
  }

  public static calculateResearchTimeInSeconds(metalCosts: number, crystalCosts: number, researchLabLevel: number): number {
    return Math.round(((metalCosts + crystalCosts) / ((1 + researchLabLevel) * Config.getGameConfig().server.speed)) * 3600);
  }

  public static calculateFreeMissileSlots(
    siloLevel: number,
    numAntiBallisticMissiles: number,
    numInterplanetaryMissiles: number,
  ): number {
    return siloLevel * 10 - numAntiBallisticMissiles - numInterplanetaryMissiles * 2;
  }

  public static getCosts(unitID: number, currentLevel: number): IUnitCosts {
    let costs: IPricelist;

    if (InputValidator.isValidBuildingId(unitID)) {
      costs = Config.getBuildings().find(r => r.unitID === unitID).costs;
    } else if (InputValidator.isValidShipId(unitID)) {
      costs = Config.getShips().find(r => r.unitID === unitID).costs;
      currentLevel = 1;
    } else if (InputValidator.isValidDefenseId(unitID)) {
      costs = Config.getDefenses().find(r => r.unitID === unitID).costs;
      currentLevel = 1;
    } else if (InputValidator.isValidTechnologyId(unitID)) {
      costs = Config.getTechnologies().find(r => r.unitID === unitID).costs;
    } else {
      return null;
    }

    return {
      metal: Math.round(costs.metal * costs.factor ** currentLevel),
      crystal: Math.round(costs.crystal * costs.factor ** currentLevel),
      deuterium: Math.round(costs.deuterium * costs.factor ** currentLevel),
      energy: Math.round(costs.energy * costs.factor ** currentLevel),
    };
  }

  public static calculateDistance(origin: ICoordinates, destination: ICoordinates): number {
    const distances = [
      Math.abs(origin.posGalaxy - destination.posGalaxy),
      Math.abs(origin.posSystem - destination.posSystem),
      Math.abs(origin.posPlanet - destination.posPlanet),
    ];

    const distance = 5;

    if (distances[0] !== 0) {
      return distances[0] * 20000;
    }
    if (distances[1] !== 0) {
      return distances[1] * 95 + 2700;
    }
    if (distances[2] !== 0) {
      return distances[2] * 5 + 1000;
    }

    return distance;
  }

  /**
   * Calculates the time of flight in seconds
   * @param gameSpeed The speed of the game
   * @param missionSpeed The speed of the whole mission (possible values: 0, 10, 20, ..., 100)
   * @param distance The distance between the start and the end
   * @param slowestShipSpeed The speed of the slowest ship in the fleet
   */
  public static calculateTimeOfFlight(
    gameSpeed: number,
    missionSpeed: number,
    distance: number,
    slowestShipSpeed: number,
  ): number {
    // source: http://owiki.de/index.php?title=Flugzeit
    return Math.round(
      ((3500 * gameSpeed) / (missionSpeed / 100)) * Math.pow((distance * 10) / slowestShipSpeed, 0.5) + 10,
    );
  }

  public static getSlowestShipSpeed(units: IShipUnits): number {
    const unitData = Config.getGameConfig();

    let minimum: number = Number.MAX_VALUE;

    for (const ship in units) {
      if (!units.hasOwnProperty(ship)) {
        continue;
      }
      const speed = unitData.units.ships.find(r => r.unitID === Number(ship)).stats.speed;
      if (units[ship] > 0 && speed < minimum) {
        minimum = speed;
      }
    }

    return minimum;
  }
}
