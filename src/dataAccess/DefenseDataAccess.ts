import Database from "../common/Database";
import IDefenseDataAccess from "../interfaces/dataAccess/IDefenseDataAccess";
import squel = require("safe-squel");
import Defenses from "../units/Defenses";

/**
 * This class defines a DataAccess to interact with the defenses-table in the database
 */
export default class DefenseDataAccess implements IDefenseDataAccess {
  /**
   * Returns a list of defenses on a given planet owner by a given user
   * @param userID the ID of the user
   * @param planetID the ID of the planet
   */
  public async getDefenses(planetID: number, userID: number): Promise<Defenses> {
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

  /**
   * Creates a new row in the database.
   * @param planetID the ID of the planet
   * @param connection a connection from the connection-pool, if this query should be executed within a transaction
   */
  public async createDefenseRow(planetID: number, connection = null) {
    const query = `INSERT INTO defenses (\`planetID\`) VALUES (${planetID});`;

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }
}
