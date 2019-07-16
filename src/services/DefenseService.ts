import { Database } from "../common/Database";

import squel = require("squel");

export class DefenseService {
  public static async createDefenseRow(planetID: number, connection = null) {
    const query = `INSERT INTO defenses (\`planetID\`) VALUES (${planetID});`;

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }

  public static async getDefenses(userID: number, planetID: number) {
    const query: string = squel
      .select()
      .field("p.ownerID", "ownerID")
      .field("d.*")
      .from("defenses", "d")
      .left_join("planets", "p", "d.planetID = p.planetID")
      .where("d.planetID = ?", planetID)
      .where("p.ownerID = ?", userID)
      .toString();

    const [[rows]] = await Database.query(query);

    return rows;
  }
}
