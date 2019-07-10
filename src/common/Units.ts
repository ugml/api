import { ICosts } from "../interfaces/ICosts";
import { IPricelist } from "../interfaces/IPricelist";
import { Globals } from "./Globals";
import { InputValidator } from "./InputValidator";

const enum UnitType {
  BUILDING,
  SHIP,
  DEFENSE,
  TECHNOLOGY,
}

class Units {
  private _data;

  public constructor() {
    this._data = require("../config/units.json");
  }

  public getBuildings() {
    return this._data.units.buildings;
  }

  public getShips() {
    return this._data.units.ships;
  }

  public getDefenses() {
    return this._data.units.defenses;
  }

  public getTechnologies() {
    return this._data.units.technologies;
  }

  public getRequirements() {
    return this._data.requirements;
  }

  public getMappings() {
    return this._data.mappings;
  }

  public getCosts(buildingID: number, currentLevel: number, unitType: UnitType): ICosts {
    let costs: IPricelist;

    switch (unitType) {
      case UnitType.BUILDING:
        if (buildingID < Globals.MIN_BUILDING_ID || Globals.MAX_BUILDING_ID < buildingID) return null;
        costs = this.getBuildings()[buildingID];
        break;
      case UnitType.SHIP:
        if (buildingID < Globals.MIN_SHIP_ID || Globals.MAX_SHIP_ID < buildingID) return null;
        costs = this.getShips()[buildingID];
        break;
      case UnitType.DEFENSE:
        if (buildingID < Globals.MIN_DEFENSE_ID || Globals.MAX_DEFENSE_ID < buildingID) return null;
        costs = this.getDefenses()[buildingID];
        break;
      case UnitType.TECHNOLOGY:
        if (buildingID < Globals.MIN_TECHNOLOGY_ID || Globals.MAX_TECHNOLOGY_ID < buildingID) return null;
        costs = this.getTechnologies()[buildingID];
        break;
    }

    return {
      metal: costs.metal * costs.factor ** currentLevel,
      crystal: costs.crystal * costs.factor ** currentLevel,
      deuterium: costs.deuterium * costs.factor ** currentLevel,
      energy: costs.energy * costs.factor ** currentLevel,
    };
  }

  public getBuildTimeInSeconds(costMetal, costCrystal, shipyardLvl, naniteLvl) {
    return 3600 * ((costMetal + costCrystal) / (2500 * (1 + shipyardLvl) * Math.pow(2, naniteLvl)));
  }

  public isValidBuildOrder(buildOrders: object, unitType: UnitType): boolean {
    let minID = 0;
    let maxID = 0;

    if (unitType === UnitType.BUILDING || unitType === UnitType.TECHNOLOGY) return null;

    switch (unitType) {
      case UnitType.SHIP:
        minID = Globals.MIN_SHIP_ID;
        maxID = Globals.MAX_SHIP_ID;
        break;
      case UnitType.DEFENSE:
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
}

export { Units, UnitType };
