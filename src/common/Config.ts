import IGameConfig, { IBuilding, IDefense, IShip, ITechnology } from "../interfaces/IGameConfig";

export default class Config {

  public static getGameConfig(): IGameConfig {
    return require("../config/game.json");
  }

  public static getBuildings(): IBuilding[] {
    return require("../config/game.json").units.buildings;
  }

  public static getShips(): IShip[] {
    return require("../config/game.json").units.ships;
  }

  public static getDefenses(): IDefense[] {
    return require("../config/game.json").units.defenses;
  }

  public static getTechnologies(): ITechnology[] {
    return require("../config/game.json").units.technologies;
  }
}
