import IUnit from "../interfaces/IUnit";
import InputValidator from "../common/InputValidator";

export default class UserInfo implements IUnit {
  public userID: number;
  public username: string;

  public isValid(): boolean {
    if (!InputValidator.isSet(this.userID) || this.userID <= 0) {
      return false;
    }

    if (!InputValidator.isSet(this.username) || this.username.length > 20 || this.username.length < 5) {
      return false;
    }

    return true;
  }
}
