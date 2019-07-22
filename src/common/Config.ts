/***
 * Helper-class to get the current game-configuration
 */
import { IGameConfig } from "../interfaces/IGameConfig";

// TODO: define Interfaces for return-values
class Config {
  public static getGameConfig(): IGameConfig {
    return require("../config/game.json");
  }

  public static getRequirements() {
    return require("../config/units.json").requirements;
  }

  public static getMappings() {
    return require("../config/units.json").mappings;
  }

  public static getBuildings() {
    return require("../config/units.json").units.buildings;
  }

  public static getShips() {
    return require("../config/units.json").units.ships;
  }

  public static getDefenses() {
    return require("../config/units.json").units.defenses;
  }

  public static getTechnologies() {
    return require("../config/units.json").units.technologies;
  }
}

export { Config };
