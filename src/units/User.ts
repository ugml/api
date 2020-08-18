import { Globals } from "../common/Globals";
import IUnit from "../interfaces/IUnit";
import InputValidator from "../common/InputValidator";

export default class User implements IUnit {
  public userID: number;

  public username: string;

  public password: string;

  public email: string;

  public lastTimeOnline: number;

  public currentPlanet: number;

  public bTechID: number;

  public bTechEndTime: number;

  public isResearching(): boolean {
    return this.bTechID > 0 && this.bTechEndTime > 0;
  }

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
