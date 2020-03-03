import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import SerializationHelper from "../common/SerializationHelper";
import IUserService from "../interfaces/IUserService";
import User from "../units/User";
import squel = require("safe-squel");
import EntityInvalidException from "../exceptions/EntityInvalidException";

/**
 * This class defines a service to interact with the users-table in the database
 */
export default class UserService implements IUserService {
  /**
   * Returns all information about an authenticated user.
   * @param userID The ID of the currently authenticated user
   */
  public async getAuthenticatedUser(userID: number): Promise<User> {
    const query: string = squel
      .select()
      .field("*")
      .from("users")
      .where("userID = ?", userID)
      .toString();

    const [result] = await Database.query(query);

    return SerializationHelper.toInstance(new User(), JSON.stringify(result[0]));
  }

  /**
   * Returns information about a user.
   * This information does not contain sensible data (like email or passwords).
   * @param userID The ID of the user
   * @returns A user-object
   */
  public async getUserById(userID: number): Promise<User> {
    const query: string = squel
      .select()
      .distinct()
      .field("userID")
      .field("username")
      .from("users")
      .where("userID = ?", userID)
      .toString();

    const [result] = await Database.query(query);

    if (!InputValidator.isSet(result)) {
      return null;
    }

    return SerializationHelper.toInstance(new User(), JSON.stringify(result[0]));
  }

  /**
   * Returns informations about a user.
   * This information does contain sensible data which is needed for authentication (like email or passwords).
   * @param email The email of the user
   * @returns A user-object
   */
  public async getUserForAuthentication(email: string): Promise<User> {
    const query: string = squel
      .select({ autoQuoteFieldNames: true })
      .field("userID")
      .field("email")
      .field("password")
      .from("users")
      .where("email = ?", email)
      .toString();

    const [result] = await Database.query(query);

    if (!InputValidator.isSet(result)) {
      return null;
    }

    return SerializationHelper.toInstance(new User(), JSON.stringify(result[0]));
  }

  /**
   * Checks, if a username of a email-address is already taken.
   * Returns an object containing the following informations:
   * ```
   * {
   *   username_taken: 0 (if not taken),
   *   email_taken: 1 (if taken)
   * }
   * ```
   * @param username the username
   * @param email the email-address
   */
  public async checkIfNameOrMailIsTaken(username: string, email: string) {
    const query =
      `SELECT EXISTS (SELECT 1 FROM users WHERE username LIKE '${username}') AS \`username_taken\`, ` +
      `EXISTS (SELECT 1  FROM users WHERE email LIKE '${email}') AS \`email_taken\``;

    const [[data]] = await Database.query(query);

    return data;
  }

  /**
   * Returns a new, not yet taken userID
   * @returns The new ID
   */
  public async getNewId(): Promise<number> {
    const queryUser = "CALL getNewUserId();";

    const [[[result]]] = await Database.query(queryUser);

    return result.userID;
  }

  /**
   * Stores the current object in the database
   * @param user A user-object
   * @param connection An open database-connection, if the query should be run within a transaction
   */
  public async createNewUser(user: User, connection) {
    const query: string = squel
      .insert({ autoQuoteFieldNames: true })
      .into("users")
      .set("userID", user.userID)
      .set("username", user.username)
      .set("password", user.password)
      .set("email", user.email)
      .set("lastTimeOnline", user.lastTimeOnline)
      .set("currentPlanet", user.currentPlanet)
      .toString();

    if (connection === null) {
      return await Database.query(query);
    } else {
      return await connection.query(query);
    }
  }

  /**
   * Updates the userdata in the database
   * @param user A user-object
   * @param connection An open database-connection, if the query should be run within a transaction
   */
  public async updateUserData(user: User, connection = null) {
    let query = squel.update().table("users");

    if (typeof user.username !== "undefined") {
      query = query.set("username", user.username);
    }

    if (typeof user.password !== "undefined") {
      query = query.set("password", user.password);
    }

    if (typeof user.email !== "undefined") {
      query = query.set("email", user.email);
    }

    if (typeof user.lastTimeOnline !== "undefined") {
      query = query.set("lastTimeOnline", user.lastTimeOnline);
    }

    if (typeof user.currentPlanet !== "undefined") {
      query = query.set("currentPlanet", user.currentPlanet);
    }

    if (typeof user.bTechID !== "undefined") {
      query = query.set("bTechID", user.bTechID);
    }

    if (typeof user.bTechEndTime !== "undefined") {
      query = query.set("bTechEndTime", user.bTechEndTime);
    }

    query = query.where("userID = ?", user.userID);

    if (connection === null) {
      return await Database.query(query.toString());
    } else {
      return await connection.query(query.toString());
    }
  }
}
