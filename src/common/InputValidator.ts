import Config from "./Config";
import { Globals } from "./Globals";
import BuildOrderItem from "../entities/common/BuildOrderItem";

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

  public static isSet(input): boolean {
    return !(input === "" || typeof input === "undefined" || input === null || input.length === 0 || input === {});
  }

  public static sanitizeString(input: string): string {
    return input.replace(/[^a-z0-9@ .,_-]/gim, "").trim();
  }

  public static isValidEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
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

  public static isValidBuildOrder(buildOrders: BuildOrderItem[], unitType: Globals.UnitType): boolean {
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

    for (const order of buildOrders) {
      if (order.unitID < minID || order.unitID > maxID || order.amount < 0) {
        return false;
      }
    }

    return true;
  }

  public static isValidPosition(posGalaxy, posSystem, posPlanet = 1): boolean {
    return (
      posGalaxy >= 1 &&
      posGalaxy <= Config.getGameConfig().server.limits.galaxy.max &&
      posSystem >= 1 &&
      posSystem <= Config.getGameConfig().server.limits.system.max &&
      posPlanet >= 1 &&
      posPlanet <= Config.getGameConfig().server.limits.position.max
    );
  }
}
