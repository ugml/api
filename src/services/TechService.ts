import { Database } from "../common/Database";
import { ITechService } from "../interfaces/ITechService";

import squel = require("squel");

export default class TechService implements ITechService {
  public async createTechRow(userID: number, connection = null) {
    const query = `INSERT INTO techs (\`userID\`) VALUES (${userID});`;

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }

  public async getTechs(userID: number) {
    const query: string = squel
      .select()
      .from("techs")
      .where("userID = ?", userID)
      .toString();

    const [[rows]] = await Database.query(query);

    return rows;
  }
}
