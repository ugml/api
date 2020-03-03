import IUnits from "../interfaces/IUnits";
import InputValidator from "../common/InputValidator";

/**
 * This class represents a row in the ResetTokens-table
 */
export default class ResetToken implements IUnits {
  /**
   * The Mail-Adress for which a new password is requested
   */
  public email: string;

  /**
   * The IP-Adress, from which the request was made
   */
  public ipRequested: string;

  /**
   * The token to reset the password
   */
  public resetToken: string;

  /**
   * The timestamp, at which the request was made
   */
  public requestedAt: number;

  /**
   * Returns, if the contains valid data or not
   */
  public isValid(): boolean {
    if (!InputValidator.isSet(this.email) || this.email.length > 64) {
      return false;
    }

    if (!InputValidator.isSet(this.ipRequested) || this.ipRequested.length > 45 || this.ipRequested.length < 7) {
      return false;
    }

    if (!InputValidator.isSet(this.resetToken) || this.resetToken.length > 64) {
      return false;
    }

    if (!InputValidator.isSet(this.requestedAt) || this.requestedAt <= 0) {
      return false;
    }

    return true;
  }
}
