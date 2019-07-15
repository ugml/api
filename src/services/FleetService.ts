import { Database } from "../common/Database";
import { InputValidator } from "../common/InputValidator";
import { Logger } from "../common/Logger";
import { SerializationHelper } from "../common/SerializationHelper";
import { Buildings } from "../units/Buildings";

import squel = require("squel");

export class FleetService {
  public static async createFleetRow(planetID: number, connection = null) {
    const query = `INSERT INTO fleet (\`planetID\`) VALUES (${planetID});`;

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }
}
