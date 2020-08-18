import IUserRepository from "../interfaces/repositories/IUserRepository";
import User from "../units/User";
import { injectable } from "inversify";
import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import * as squel from "safe-squel";
import SerializationHelper from "../common/SerializationHelper";

@injectable()
export default class UserRepository implements IUserRepository {
  public async getUserForAuthentication(email: string): Promise<User> {
    const query: string = squel
      .select()
      .from("users")
      .where("email = ?", email)
      .toString();

    const [[result]] = await Database.query(query);

    if (!InputValidator.isSet(result)) {
      return null;
    }

    return SerializationHelper.toInstance(new User(), JSON.stringify(result));
  }

  public async exists(id: number): Promise<boolean> {
    const query: string = squel
      .select()
      .from("users")
      .where("userID = ?", id)
      .toString();

    return InputValidator.isSet(await Database.query(query));
  }

  public async getById(id: number): Promise<User> {
    const query: string = squel
      .select()
      .from("users")
      .where("userID = ?", id)
      .toString();

    const [rows] = await Database.query(query);

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    const user = SerializationHelper.toInstance(new User(), JSON.stringify(rows[0]));

    delete user.password;

    return user;
  }

  public async save(t: User): Promise<void> {
    const query = squel.update().table("users");

    if (InputValidator.isSet(t.username)) {
      query.set("username", t.username);
    }
    if (InputValidator.isSet(t.password)) {
      query.set("password", t.password);
    }
    if (InputValidator.isSet(t.email)) {
      query.set("email", t.email);
    }
    if (InputValidator.isSet(t.lastTimeOnline)) {
      query.set("lastTimeOnline", t.lastTimeOnline);
    }
    if (InputValidator.isSet(t.currentPlanet)) {
      query.set("currentPlanet", t.currentPlanet);
    }
    if (InputValidator.isSet(t.bTechID)) {
      query.set("bTechID", t.bTechID);
    }
    if (InputValidator.isSet(t.bTechEndTime)) {
      query.set("bTechEndTime", t.bTechEndTime);
    }

    query.where("userID = ?", t.userID);

    await Database.query(query.toString());
  }

  public async create(t: User): Promise<User> {
    const query: string = squel
      .insert({ autoQuoteFieldNames: true })
      .into("users")
      .set("userID", t.userID)
      .set("username", t.username)
      .set("password", t.password)
      .set("email", t.email)
      .set("lastTimeOnline", t.lastTimeOnline)
      .set("currentPlanet", t.currentPlanet)
      .toString();

    await Database.query(query);

    return t;
  }

  public async createTransactional(t: User, connection): Promise<User> {
    const query: string = squel
      .insert({ autoQuoteFieldNames: true })
      .into("users")
      .set("userID", t.userID)
      .set("username", t.username)
      .set("password", t.password)
      .set("email", t.email)
      .set("lastTimeOnline", t.lastTimeOnline)
      .set("currentPlanet", t.currentPlanet)
      .toString();
    return await connection.query(query);
  }

  public async checkUsernameTaken(username: string): Promise<boolean> {
    const query = `SELECT EXISTS (SELECT 1 FROM users WHERE username LIKE '${username}') as result`;

    const [[data]] = await Database.query(query);

    return data.result === 1;
  }

  public async checkEmailTaken(email: string): Promise<boolean> {
    const query = `SELECT EXISTS (SELECT 1 FROM users WHERE email LIKE '${email}') as result`;

    const [[data]] = await Database.query(query);

    return data.result === 1;
  }

  public async getNewId(): Promise<number> {
    const queryUser = "CALL getNewUserId();";

    const [[[result]]] = await Database.query(queryUser);

    return result.userID;
  }
}
