import { Database } from "../common/Database";
import { InputValidator } from "../common/InputValidator";
import { Logger } from "../common/Logger";
import { SerializationHelper } from "../common/SerializationHelper";
import { Buildings } from "../units/Buildings";

import squel = require("squel");

export class TechService {
  public static async createTechRow(userID: number, connection = null) {
    const query = `INSERT INTO techs (\`userID\`) VALUES (${userID});`;

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }
}
