import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IUnits from "../interfaces/IUnits";
import PlanetType = Globals.PlanetType;

/**
 * Represents a user-row in the database
 */
export default class Event implements IUnits {
  public eventID: number;
  public ownerID: number;
  public mission: number;
  public fleetlist: string;
  public start_id: number;
  public start_type: PlanetType;
  public start_time: number;
  public end_id: number;
  public end_type: PlanetType;
  public end_time: number;
  public loaded_metal: number;
  public loaded_crystal: number;
  public loaded_deuterium: number;
  public returning: boolean;
  public deleted: boolean;

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
    if (!InputValidator.isSet(this.start_id) || this.start_id < 0) {
      return false;
    }
    if (this.start_type !== PlanetType.Planet && this.start_type !== PlanetType.Moon) {
      return false;
    }
    if (!InputValidator.isSet(this.start_time) || this.start_time < 0) {
      return false;
    }
    if (!InputValidator.isSet(this.end_id) || this.end_id < 0) {
      return false;
    }
    if (this.end_type !== PlanetType.Planet && this.end_type !== PlanetType.Moon) {
      return false;
    }
    if (!InputValidator.isSet(this.end_time) || this.end_time < 0) {
      return false;
    }
    if (!InputValidator.isSet(this.loaded_metal) || this.loaded_metal < 0) {
      return false;
    }
    if (!InputValidator.isSet(this.loaded_crystal) || this.loaded_crystal < 0) {
      return false;
    }
    if (!InputValidator.isSet(this.loaded_deuterium) || this.loaded_deuterium < 0) {
      return false;
    }

    return true;
  }
}
