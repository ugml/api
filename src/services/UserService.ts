import { Database } from "../common/Database";
import { InputValidator } from "../common/InputValidator";
import { SerializationHelper } from "../common/SerializationHelper";
import { User } from "../units/User";
import squel = require("squel");

export class UserService {
  /**
   * Returns all information about an authenticated user.
   * @param userID The ID of the currently authenticated user
   */
  public static async getAuthenticatedUser(userID: number): Promise<User> {
    const query: string = squel
      .select()
      .field("userID")
      .field("username")
      .field("email")
      .field("onlinetime")
      .field("currentplanet")
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
  public static async getUserById(userID: number): Promise<User> {
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
  public static async getUserForAuthentication(email: string): Promise<User> {
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

  public static async checkIfNameOrMailIsTaken(username: string, email: string) {
    const query =
      `SELECT EXISTS (SELECT 1 FROM users WHERE username LIKE '${username}') AS \`username_taken\`, ` +
      `EXISTS (SELECT 1  FROM users WHERE email LIKE '${email}') AS \`email_taken\``;

    const [[data]] = await Database.query(query);

    return data;
  }

  /**
   * Returns a new userID
   * @returns The new ID
   */
  public static async getNewId(): Promise<number> {
    const queryUser = "CALL getNewUserId();";

    const [[[result]]] = await Database.query(queryUser);

    return result.userID;
  }

  /**
   * Stores the current object in the database
   * @param user A user-object
   * @param connection An open database-connection, if the query should be run within a transaction
   */
  public static async createNewUser(user: User, connection) {
    const query: string = squel
      .insert({ autoQuoteFieldNames: true })
      .into("users")
      .set("userID", user.userID)
      .set("username", user.username)
      .set("password", user.password)
      .set("email", user.email)
      .set("onlinetime", user.onlinetime)
      .set("currentplanet", user.currentplanet)
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
  public static async updateUserData(user: User, connection = null) {
    // TODO: check which fields are set and only update those
    const query: string = squel
      .update()
      .table("users")
      .set("username", user.username)
      .set("password", user.password)
      .set("email", user.email)
      .where("userID = ?", user.userID)
      .toString();

    if (connection === null) {
      return await Database.query(query);
    } else {
      return await connection.query(query);
    }
  }
}
