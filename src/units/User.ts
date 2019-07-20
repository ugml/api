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
    // TODO
    return false;
  }
}
