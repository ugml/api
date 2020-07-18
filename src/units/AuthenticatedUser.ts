import IUnit from "../interfaces/IUnit";
import InputValidator from "../common/InputValidator";

/**
 * Represents a user-row in the database
 */
export default class AuthenticatedUser implements IUnit {
  /**
   * The ID of the user
   */
  public userID: number;

  /**
   * The encrypted password of the user
   */
  public password: string;

  /**
   * The e-mail address of the user
   */
  public email: string;

  /**
   * Returns, if the contains valid data or not
   */
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
