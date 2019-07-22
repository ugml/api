import { ICosts } from "../interfaces/ICosts";
import { IPricelist } from "../interfaces/IPricelist";
import { Config } from "./Config";
import InputValidator from "./InputValidator";

export default class Calculations {
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

  public static calculateResearchTimeInSeconds(metalCosts: number, crystalCosts: number, researchLab: number): number {
    return Math.round(((metalCosts + crystalCosts) / ((1 + researchLab) * Config.getGameConfig().speed)) * 3600);
  }

  public static calculateFreeMissileSlots(
    siloLevel: number,
    numAntiBallisticMissiles: number,
    numInterplanetaryMissiles: number,
  ): number {
    return siloLevel * 10 - numAntiBallisticMissiles - numInterplanetaryMissiles * 2;
  }

  public static getCosts(unitID: number, currentLevel: number): ICosts {
    let costs: IPricelist;

    if (InputValidator.isValidBuildingId(unitID)) {
      costs = Config.getBuildings()[unitID];
    } else if (InputValidator.isValidShipId(unitID)) {
      costs = Config.getShips()[unitID];
    } else if (InputValidator.isValidDefenseId(unitID)) {
      costs = Config.getDefenses()[unitID];
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
