import { Config } from "./Config";
import { Globals } from "./Globals";

export default class InputValidator {
  public static isValidInt(input: string): boolean {
    if (!this.isSet(input)) {
      return false;
    }

    if (typeof input === "number") {
      return true;
    }

    return input.match(/^-{0,1}\d+$/) !== null;
  }

  public static isValidFloat(input: string): boolean {
    if (!this.isSet(input)) {
      return false;
    }

    if (typeof input === "number") {
      return true;
    }

    return input.match(/^\d+\.\d+$/) !== null;
  }

  public static isValidJson(input: string): boolean {
    try {
      JSON.parse(input);
    } catch (e) {
      return false;
    }
    return true;
  }

  public static isSet(input: any): boolean {
    return !(input === "" || typeof input === "undefined" || input === null || input.length === 0);
  }

  public static sanitizeString(input: string): string {
    return input.replace(/[^a-z0-9@ .,_-]/gim, "").trim();
  }

  public static isValidBuildingId(unitID: number): boolean {
    return Globals.MIN_BUILDING_ID <= unitID && unitID <= Globals.MAX_BUILDING_ID;
  }

  public static isValidDefenseId(unitID: number): boolean {
    return Globals.MIN_DEFENSE_ID <= unitID && unitID <= Globals.MAX_DEFENSE_ID;
  }

  public static isValidShipId(unitID: number): boolean {
    return Globals.MIN_SHIP_ID <= unitID && unitID <= Globals.MAX_SHIP_ID;
  }

  public static isValidTechnologyId(unitID: number): boolean {
    return Globals.MIN_TECHNOLOGY_ID <= unitID && unitID <= Globals.MAX_TECHNOLOGY_ID;
  }

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

  public static isValidPosition(galaxy, system, planet = 1): boolean {
    return (
      galaxy >= 1 &&
      galaxy <= Config.getGameConfig().pos_galaxy_max &&
      system >= 1 &&
      system <= Config.getGameConfig().pos_system_max &&
      planet >= 1 &&
      planet <= Config.getGameConfig().pos_planet_max
    );
  }
}
