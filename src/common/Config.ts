/***
 * Helper-class to get the current game-configuration
 */
class Config {
  /***
   * Returns the current game-configuration
   */
  public static get Get()/*: IGameConfig*/ {
    return require("../config/game.json");
  }
}

export { Config };
