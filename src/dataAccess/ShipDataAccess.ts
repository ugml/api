import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import IShipDataAccess from "../interfaces/dataAccess/IShipDataAccess";

import squel = require("safe-squel");

/**
 * This class defines a DataAccess to interact with the ships-table in the database
 */
export default class ShipDataAccess implements IShipDataAccess {
  /**
   * Returns a list of ships on a given planet, owned by the given user
   * @param userID the ID of the user
   * @param planetID the ID of the planet
   */
  public async getShips(userID: number, planetID: number) {
    const query: string = squel
      .select()
      .field("p.ownerID")
      .field("s.*")
      .from("ships", "s")
      .left_join("planets", "p", "s.planetID = p.planetID")
      .where("s.planetID = ?", planetID)
      .where("p.ownerID = ?", userID)
      .toString();

    const [[rows]] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return rows;
  }

  /**
   * Creates a new row in the database.
   * @param planetID the ID of the planet
   * @param connection a connection from the connection-pool, if this query should be executed within a transaction
   */
  public async createShipsRow(planetID: number, connection = null) {
    const query = `INSERT INTO ships (\`planetID\`) VALUES (${planetID});`;

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }
}
