import InputValidator from "../common/InputValidator";
import { IUnits } from "../interfaces/IUnits";

/***
 * @class
 * @classdesc Represents a user
 *
 */
export default class User implements IUnits {
  /**
   * The ID of the user
   * @type {number}
   */
  public userID: number;

  /**
   * The name of the user
   * @type {string}
   */
  public username: string;

  /**
   * The encrypted password of the user
   * @type {string}
   */
  public password: string;

  /**
   * The e-mail address of the user
   * @type {string}
   */
  public email: string;

  /**
   * The unix-timestamp of the last time the user was online
   * @type {number}
   */
  public onlinetime: number;

  /**
   * The current planet of the user
   * @type {number}
   */
  public currentplanet: number;

  /**
   * Checks, if the object holds valid data
   */
  public isValid(): boolean {
    if (!InputValidator.isSet(this.userID) || this.userID <= 0) return false;
    if (!InputValidator.isSet(this.username) || this.username.length > 20) return false;
    if (!InputValidator.isSet(this.password) || this.password.length > 60) return false;
    if (!InputValidator.isSet(this.email) || this.email.length > 64) return false;
    if (!InputValidator.isSet(this.onlinetime) || this.onlinetime <= 0) return false;
    if (!InputValidator.isSet(this.currentplanet) || this.currentplanet <= 0) return false;

    return true;
  }
}
