import IUnit from "../interfaces/IUnit";
import InputValidator from "../common/InputValidator";

export default class AuthenticatedUser implements IUnit {
  public userID: number;

  public password: string;

  public email: string;

  public isValid(): boolean {
    if (!InputValidator.isSet(this.userID) || this.userID <= 0) {
      return false;
    }

    if (!InputValidator.isSet(this.password) || this.password.length > 60) {
      return false;
    }

    if (!InputValidator.isSet(this.email) || this.email.length > 64) {
      return false;
    }

    return true;
  }
}
