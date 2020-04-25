import { Globals } from "../common/Globals";
import IUnit from "../interfaces/IUnit";
import InputValidator from "../common/InputValidator";

/**
 * Represents a user-row in the database
 */
export default class User implements IUnit {
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
  public lastTimeOnline: number;

  /**
   * The current planet of the user
   */
  public currentPlanet: number;

  /**
   * The ID of the technology which is currently being researched.
   * This value is 0 if no technology is currently being researched.
   */
  public bTechID: number;

  /**
   * The time, at which the research will be completed
   */
  public bTechEndTime: number;

  /**
   *  Checks, if the planet is currently researching
   */
  public isResearching(): boolean {
    return this.bTechID > 0 && this.bTechEndTime > 0;
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

    if (!InputValidator.isSet(this.lastTimeOnline) || this.lastTimeOnline <= 0) {
      return false;
    }

    if (!InputValidator.isSet(this.currentPlanet) || this.currentPlanet <= 0) {
      return false;
    }

    if (!InputValidator.isSet(this.bTechID) || this.bTechID < 0 || this.bTechID > Globals.MAX_TECHNOLOGY_ID) {
      return false;
    }

    if (!InputValidator.isSet(this.bTechEndTime) || this.bTechEndTime < 0) {
      return false;
    }

    return true;
  }
}
