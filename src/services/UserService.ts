import { Database } from "../common/Database";
import { InputValidator } from "../common/InputValidator";
import { SerializationHelper } from "../common/SerializationHelper";
import { User } from "../units/User";
import squel = require("squel");

export class UserService {
  public static async GetAuthenticatedUser(userID: number): Promise<User> {
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

  public static async GetUserById(userID: number): Promise<User> {
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

  public static async GetUserForAuthentication(email: string): Promise<User> {
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

  public static async CheckIfNameOrMailIsTaken(username: string, email: string) {
    const query =
      `SELECT EXISTS (SELECT 1 FROM users WHERE username LIKE '${username}') AS \`username_taken\`, ` +
      `EXISTS (SELECT 1  FROM users WHERE email LIKE '${email}') AS \`email_taken\``;

    const [[data]] = await Database.query(query);

    return data;
  }

  public static async GetNewId(): Promise<number> {
    const queryUser = "CALL getNewUserId();";

    const [[[result]]] = await Database.query(queryUser);

    return result.userID;
  }
}
