import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IUnit from "../interfaces/IUnit";
import PlanetType = Globals.PlanetType;

/**
 * Represents a user-row in the database
 */
export default class Event implements IUnit {
  public eventID: number;
  public ownerID: number;
  public mission: number;
  public fleetlist: string;
  public startID: number;
  public startType: PlanetType;
  public startTime: number;
  public endID: number;
  public endType: PlanetType;
  public endTime: number;
  public loadedMetal: number;
  public loadedCrystal: number;
  public loadedDeuterium: number;
  public returning: boolean;
  public inQueue: boolean;
  public processed: boolean;

  /**
   * Returns, if the contains valid data or not
   */
  public isValid(): boolean {
    if (!InputValidator.isSet(this.eventID) || this.eventID <= 0) {
      return false;
    }
    if (!InputValidator.isSet(this.ownerID) || this.ownerID < 0) {
      return false;
    }
    if (!InputValidator.isSet(this.mission) || this.mission < 0) {
      return false;
    }
    // TODO: validate against schema
    if (!InputValidator.isSet(this.fleetlist) || this.fleetlist.length === 0) {
      return false;
    }
    if (!InputValidator.isSet(this.startID) || this.startID < 0) {
      return false;
    }
    if (
      this.startType !== PlanetType.PLANET &&
      this.startType !== PlanetType.MOON &&
      this.startType !== PlanetType.DEBRIS
    ) {
      return false;
    }
    if (!InputValidator.isSet(this.startTime) || this.startTime < 0) {
      return false;
    }
    if (!InputValidator.isSet(this.endID) || this.endID < 0) {
      return false;
    }
    if (this.endType !== PlanetType.PLANET && this.endType !== PlanetType.MOON && this.endType !== PlanetType.DEBRIS) {
      return false;
    }
    if (!InputValidator.isSet(this.endTime) || this.endTime < 0) {
      return false;
    }
    if (!InputValidator.isSet(this.loadedMetal) || this.loadedMetal < 0) {
      return false;
    }
    if (!InputValidator.isSet(this.loadedCrystal) || this.loadedCrystal < 0) {
      return false;
    }
    if (!InputValidator.isSet(this.loadedDeuterium) || this.loadedDeuterium < 0) {
      return false;
    }

    return true;
  }
}
