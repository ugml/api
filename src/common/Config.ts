/**
 * Helper-class to get the current game-configuration
 */
import IGameConfig from "../interfaces/IGameConfig";

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
   * Returns all configured requirements for all units
   */
  public static getRequirements() {
    return require("../config/units.json").requirements;
  }

  /**
   * Returns mappings between unit-name <-> unitID
   */
  public static getMappings() {
    return require("../config/units.json").mappings;
  }

  /**
   * Returns a list of all buildings with their costs and cost-increase-factor per level
   */
  public static getBuildings() {
    return require("../config/units.json").units.buildings;
  }

  // TODO: reference interface
  /**
   * Returns a list of all ships with their costs, rapidfire and properties like speed and capacity
   */
  public static getShips() {
    return require("../config/units.json").units.ships;
  }

  /**
   * Returns a list of all ships with their costs
   */
  public static getDefenses() {
    return require("../config/units.json").units.defenses;
  }

  /**
   * Returns a list of all technologies with their costs and cost-increase-factor per level
   */
  public static getTechnologies() {
    return require("../config/units.json").units.technologies;
  }
}
