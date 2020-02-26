import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import SerializationHelper from "../common/SerializationHelper";
import IBuildingService from "../interfaces/IBuildingService";
import Buildings from "../units/Buildings";

import squel = require("safe-squel");

/**
 * This class defines a service to interact with the buildings-table in the database
 */
export default class BuildingService implements IBuildingService {
  /**
   * Returns a list of buildings on a given planet
   * @param planetID the ID of the planet
   */
  public async getBuildings(planetID: number): Promise<Buildings> {
    const query: string = squel
      .select()
      .from("buildings", "b")
      .where("b.planetID = ?", planetID)
      .toString();

    const [rows] = await Database.query(query);

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return SerializationHelper.toInstance(new Buildings(), JSON.stringify(rows[0]));
  }

  /**
   * Creates a new row in the database.
   * @param planetID the ID of the planet
   * @param connection a connection from the connection-pool, if this query should be executed within a transaction
   */
  public async createBuildingsRow(planetID: number, connection = null) {
    const query = `INSERT INTO buildings (\`planetID\`) VALUES (${planetID});`;

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }
}
