import squel = require("squel");
import { Database } from "../common/Database";
import { Logger } from "../common/Logger";
import { IUnits } from "../interfaces/IUnits";

/***
 * @class
 * @classdesc Represents a user
 *
 */
class User implements IUnits {
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

  /***
   * Updates the current object in the database
   */
  public save(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const query: string = squel
        .update()
        .table("users")
        .set("username", this.username)
        .set("password", this.password)
        .set("email", this.email)
        .set("onlinetime", this.onlinetime)
        .set("currentplanet", this.currentplanet)
        .where("userID = ?", this.userID)
        .toString();

      Database.query(query)
        .then(() => {
          return resolve(this);
        })
        .catch((error: string) => {
          Logger.error(error);
          return reject(error);
        });
    });
  }

  /***
   * Stores the current object in the database
   */
  public async create(connection = null): Promise<{}> {
    const query: string = squel
      .insert({ autoQuoteFieldNames: true })
      .into("users")
      .set("userID", this.userID)
      .set("username", this.username)
      .set("password", this.password)
      .set("email", this.email)
      .set("onlinetime", this.onlinetime)
      .set("currentplanet", this.currentplanet)
      .toString();

    if (connection === null) {
      return await Database.query(query);
    } else {
      return await connection.query(query);
    }
  }

  /**
   * Checks, if the object holds valid data
   */
  public isValid(): boolean {
    return false;
  }
}

export { User };
