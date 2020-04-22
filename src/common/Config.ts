/**
 * Helper-class to get the current game-configuration
 */
import IGameConfig, { IBuilding, IDefense, IShip, ITechnology } from "../interfaces/IGameConfig";

// TODO: define Interfaces for return-values
/**
 * This class reads and returns the two main config files for the game.
 */
export default class Config {
  /**
   * Returns the current configuration for the game
   */
  public static getGameConfig(): IGameConfig {
    return require("../config/game.json");
  }

  /**
   * Returns a list of all buildings with their costs and cost-increase-factor per level
   */
  public static getBuildings(): IBuilding[] {
    return require("../config/game.json").units.buildings;
  }

  /**
   * Returns a list of all ships with their costs, rapidfire and properties like speed and capacity
   */
  public static getShips(): IShip[] {
    return require("../config/game.json").units.ships;
  }

  /**
   * Returns a list of all ships with their costs
   */
  public static getDefenses(): IDefense[] {
    return require("../config/game.json").units.defenses;
  }

  /**
   * Returns a list of all technologies with their costs and cost-increase-factor per level
   */
  public static getTechnologies(): ITechnology[] {
    return require("../config/game.json").units.technologies;
  }
}
