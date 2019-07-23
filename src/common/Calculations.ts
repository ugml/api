import ICosts from "../interfaces/ICosts";
import IPricelist from "../interfaces/IPricelist";
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
      ((metalCosts + crystalCosts) / (2500 * (1 + robotFactory) * 2 ** naniteFactory * Config.getGameConfig().speed)) *
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
    return Math.round(((metalCosts + crystalCosts) / ((1 + researchLab) * Config.getGameConfig().speed)) * 3600);
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
      costs = Config.getBuildings()[unitID];
    } else if (InputValidator.isValidShipId(unitID)) {
      costs = Config.getShips()[unitID];
      currentLevel = 1;
    } else if (InputValidator.isValidDefenseId(unitID)) {
      costs = Config.getDefenses()[unitID];
      currentLevel = 1;
    } else if (InputValidator.isValidTechnologyId(unitID)) {
      costs = Config.getTechnologies()[unitID];
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
}
