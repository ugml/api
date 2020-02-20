import Config from "./Config";
import { Globals } from "./Globals";
import PlanetType = Globals.PlanetType;

/**
 * This class contains methods for input- and data-validation
 */
export default class InputValidator {
  /**
   * Checks, if a given string is a valid integer
   * @param input the input-string
   */
  public static isValidInt(input: string): boolean {
    if (!this.isSet(input)) {
      return false;
    }

    if (typeof input === "number") {
      return true;
    }

    return input.match(/^-{0,1}\d+$/) !== null;
  }

  /**
   * Checks, if a given string is a valid float
   * @param input the input-string
   */
  public static isValidFloat(input: string): boolean {
    if (!this.isSet(input)) {
      return false;
    }

    if (typeof input === "number") {
      return true;
    }

    return input.match(/^\d+\.\d+$/) !== null;
  }

  /**
   * Checks, if a given string is a valid json-string
   * @param input the input-string
   */
  public static isValidJson(input: string): boolean {
    try {
      JSON.parse(input);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Checks, if a given input is defined and set
   * @param input the input-string
   */
  public static isSet(input: any): boolean {
    return !(input === "" || typeof input === "undefined" || input === null || input.length === 0 || input === {});
  }

  /**
   * Removes all special characters from a string as well as leading and trailing whitespaces
   * @param input the input-string
   */
  public static sanitizeString(input: string): string {
    return input.replace(/[^a-z0-9@ .,_-]/gim, "").trim();
  }

  /**
   * Checks, if a given unitID is a valid buildingID
   * @param unitID a unitID
   */
  public static isValidBuildingId(unitID: number): boolean {
    return Globals.MIN_BUILDING_ID <= unitID && unitID <= Globals.MAX_BUILDING_ID;
  }

  /**
   * Checks, if a given unitID is a valid buildingID
   * @param unitID a unitID
   */
  public static isValidDefenseId(unitID: number): boolean {
    return Globals.MIN_DEFENSE_ID <= unitID && unitID <= Globals.MAX_DEFENSE_ID;
  }

  /**
   * Checks, if a given unitID is a valid shipID
   * @param unitID a unitID
   */
  public static isValidShipId(unitID: number): boolean {
    return Globals.MIN_SHIP_ID <= unitID && unitID <= Globals.MAX_SHIP_ID;
  }

  /**
   * Checks, if a given unitID is a valid technologyID
   * @param unitID a unitID
   */
  public static isValidTechnologyId(unitID: number): boolean {
    return Globals.MIN_TECHNOLOGY_ID <= unitID && unitID <= Globals.MAX_TECHNOLOGY_ID;
  }

  /**
   * Checks, if the given build-order is valid for a given unit-type
   * @param buildOrders an object representing a build-order
   * @param unitType the type of the units in the build-order
   */
  public static isValidBuildOrder(buildOrders: object, unitType: Globals.UnitType): boolean {
    let minID = 0;
    let maxID = 0;

    if (unitType === Globals.UnitType.BUILDING || unitType === Globals.UnitType.TECHNOLOGY) {
      return null;
    }

    switch (unitType) {
      case Globals.UnitType.SHIP:
        minID = Globals.MIN_SHIP_ID;
        maxID = Globals.MAX_SHIP_ID;
        break;
      case Globals.UnitType.DEFENSE:
        minID = Globals.MIN_DEFENSE_ID;
        maxID = Globals.MAX_DEFENSE_ID;
        break;
    }

    for (const order in buildOrders) {
      if (
        !InputValidator.isValidInt(order) ||
        !InputValidator.isValidInt(buildOrders[order]) ||
        parseInt(order, 10) < minID ||
        parseInt(order, 10) > maxID ||
        buildOrders[order] < 0
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Validates a given position. The planet-parameter is optional and will be set to 1 if no paramter is passed
   * @param posGalaxy the galaxy-position
   * @param posSystem the posSystem-position
   * @param posPlanet the planet-position
   */
  public static isValidPosition(posGalaxy, posSystem, posPlanet = 1): boolean {
    return (
      posGalaxy >= 1 &&
      posGalaxy <= Config.getGameConfig().posGalaxy_max &&
      posSystem >= 1 &&
      posSystem <= Config.getGameConfig().posSystem_max &&
      posPlanet >= 1 &&
      posPlanet <= Config.getGameConfig().posPlanet_max
    );
  }
}
