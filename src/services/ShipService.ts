import { Database } from "../common/Database";
import { InputValidator } from "../common/InputValidator";
import { Logger } from "../common/Logger";
import { SerializationHelper } from "../common/SerializationHelper";
import { Buildings } from "../units/Buildings";

import squel = require("squel");

export class ShipService {
  public static async createShipsRow(planetID: number, connection = null) {
    const query = `INSERT INTO ships (\`planetID\`) VALUES (${planetID});`;

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }

  public static async getShips(userID: number, planetID: number) {
    const query: string = squel
      .select()
      .field("p.ownerID")
      .field("s.*")
      .from("ships", "s")
      .left_join("planets", "p", "s.planetID = p.planetID")
      .where("s.planetID = ?", planetID)
      .where("p.ownerID = ?", userID)
      .toString();

    let [[rows]] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return rows;
  }
}
