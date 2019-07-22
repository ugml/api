import { ICosts } from "../interfaces/ICosts";
import { IPricelist } from "../interfaces/IPricelist";
import { Config } from "./Config";
import { Globals } from "./Globals";

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

  public static getCosts(buildingID: number, currentLevel: number, unitType: Globals.UnitType): ICosts {
    let costs: IPricelist;

    switch (unitType) {
      case Globals.UnitType.BUILDING:
        if (buildingID < Globals.MIN_BUILDING_ID || Globals.MAX_BUILDING_ID < buildingID) {
          return null;
        }
        costs = Config.getBuildings()[buildingID];
        break;
      case Globals.UnitType.SHIP:
        if (buildingID < Globals.MIN_SHIP_ID || Globals.MAX_SHIP_ID < buildingID) {
          return null;
        }
        costs = Config.getShips()[buildingID];
        break;
      case Globals.UnitType.DEFENSE:
        if (buildingID < Globals.MIN_DEFENSE_ID || Globals.MAX_DEFENSE_ID < buildingID) {
          return null;
        }
        costs = Config.getDefenses()[buildingID];
        break;
      case Globals.UnitType.TECHNOLOGY:
        if (buildingID < Globals.MIN_TECHNOLOGY_ID || Globals.MAX_TECHNOLOGY_ID < buildingID) {
          return null;
        }
        costs = Config.getTechnologies()[buildingID];
        break;
    }

    return {
      metal: costs.metal * costs.factor ** currentLevel,
      crystal: costs.crystal * costs.factor ** currentLevel,
      deuterium: costs.deuterium * costs.factor ** currentLevel,
      energy: costs.energy * costs.factor ** currentLevel,
    };
  }
}
