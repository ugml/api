import InputValidator from "../common/InputValidator";
import IUnits from "../interfaces/IUnits";
import {Globals} from "../common/Globals";

/**
 * Represents a user-row in the database
 */
export default class User implements IUnits {
  /**
   * The ID of the user
   */
  public userID: number;

  /**
   * The name of the user
   */
  public username: string;

  /**
   * The encrypted password of the user
   */
  public password: string;

  /**
   * The e-mail address of the user
   */
  public email: string;

  /**
   * The unix-timestamp of the last time the user was online
   */
  public last_time_online: number;

  /**
   * The current planet of the user
   */
  public current_planet: number;

  /**
   * The ID of the technology which is currently being researched.
   * This value is 0 if no technology is currently being researched.
   */
  public b_tech_id: number;

  /**
   * The time, at which the research will be completed
   */
  public b_tech_endtime: number;

  /**
   *  Checks, if the planet is currently researching
   */
  public isResearching(): boolean {
    return this.b_tech_id > 0 && this.b_tech_endtime > 0;
  }

  /**
   * Returns, if the contains valid data or not
   */
  public isValid(): boolean {
    if (!InputValidator.isSet(this.userID) || this.userID <= 0) {
      return false;
    }

    if (!InputValidator.isSet(this.username) || this.username.length > 20 || this.username.length < 5) {
      return false;
    }

    if (!InputValidator.isSet(this.password) || this.password.length > 60) {
      return false;
    }

    if (!InputValidator.isSet(this.email) || this.email.length > 64) {
      return false;
    }

    if (!InputValidator.isSet(this.last_time_online) || this.last_time_online <= 0) {
      return false;
    }

    if (!InputValidator.isSet(this.current_planet) || this.current_planet <= 0) {
      return false;
    }

    if (!InputValidator.isSet(this.b_tech_id) || this.b_tech_id < 0 || this.b_tech_id > Globals.MAX_TECHNOLOGY_ID) {
      return false;
    }

    if (!InputValidator.isSet(this.b_tech_endtime) || this.b_tech_endtime < 0) {
      return false;
    }

    return true;
  }
}
