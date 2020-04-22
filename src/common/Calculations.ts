import ICoordinates from "../interfaces/ICoordinates";
import ICosts from "../interfaces/ICosts";
import IPricelist from "../interfaces/IPricelist";
import IShipUnits from "../interfaces/IShipUnits";
import Config from "./Config";
import InputValidator from "./InputValidator";

/**
 * This class provides functionality for different common calculations
 */
export default class Calculations {
  /**
   * Calculates the buildtime for a building, ship or defense in SECONDS and PER UNIT.
   * @param metalCosts the metal-costs for the level/unit
   * @param crystalCosts the crystal-costs for the level/unit
   * @param robotFactory the current level of the robotic-factory
   * @param naniteFactory the current level of the nanite-factory
   * @returns number builtime in seconds
   */
  public static calculateBuildTimeInSeconds(
    metalCosts: number,
    crystalCosts: number,
    robotFactory: number,
    naniteFactory: number,
  ): number {
    return Math.round(
      ((metalCosts + crystalCosts) / (2500 * (1 + robotFactory) * 2 ** naniteFactory * Config.getGameConfig().server.speed)) *
        3600,
    );
  }

  /**
   * Calculates the research-time for a technology
   * @param metalCosts the metal-costs for the level
   * @param crystalCosts the crystal-costs for the level
   * @param researchLab the current level of the reserach-lab
   */
  public static calculateResearchTimeInSeconds(metalCosts: number, crystalCosts: number, researchLab: number): number {
    return Math.round(((metalCosts + crystalCosts) / ((1 + researchLab) * Config.getGameConfig().server.speed)) * 3600);
  }

  /**
   * Calculates the free missile slots
   * @param siloLevel the level of the missile silo
   * @param numAntiBallisticMissiles the amount of anti-ballistic missiles currently on the planet
   * @param numInterplanetaryMissiles the amount of interplanetary missiles currently on the planet
   */
  public static calculateFreeMissileSlots(
    siloLevel: number,
    numAntiBallisticMissiles: number,
    numInterplanetaryMissiles: number,
  ): number {
    return siloLevel * 10 - numAntiBallisticMissiles - numInterplanetaryMissiles * 2;
  }

  /**
   * Returns the costs of a unit. For building or technology,
   * the costs for the next level is returned.
   * For ships or defenses, the costs for one unit is returned.
   * @param unitID
   * @param currentLevel
   */
  public static getCosts(unitID: number, currentLevel: number): ICosts {
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

  /**
   * Calculates the distances between two planets
   * Source: http://www.owiki.de/index.php?title=Entfernung
   * @param origin The first planet
   * @param destination The second planet
   */
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

  /**
   * Returns the speed of the slowest ship in the fleet
   * @param units The sent ship in this event
   */
  public static getSlowestShipSpeed(units: IShipUnits): number {
    const unitData = require("../config/game.json");

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
