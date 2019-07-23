import Database from "../common/Database";
import ITechService from "../interfaces/ITechService";

import squel = require("safe-squel");

/**
 * This class defines a service to interact with the techs-table in the database
 */
export default class TechService implements ITechService {
  /**
   * Returns a list of technologies for a given user
   * @param userID the ID of the user
   */
  public async getTechs(userID: number) {
    const query: string = squel
      .select()
      .from("techs")
      .where("userID = ?", userID)
      .toString();

    const [[rows]] = await Database.query(query);

    return rows;
  }

  /**
   * Creates a new row in the database.
   * @param userID the ID of the user
   * @param connection a connection from the connection-pool, if this query should be executed within a transaction
   */
  public async createTechRow(userID: number, connection = null) {
    const query = `INSERT INTO techs (\`userID\`) VALUES (${userID});`;

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }
}
