import { Database } from "../common/Database";
import InputValidator from "../common/InputValidator";
import { Logger } from "../common/Logger";
import SerializationHelper from "../common/SerializationHelper";
import { IBuildingService } from "../interfaces/IBuildingService";
import Buildings from "../units/Buildings";

import squel = require("safe-squel");

export default class BuildingService implements IBuildingService {
  public async getBuildings(planetID: number): Promise<Buildings> {
    try {
      const query: string = squel
        .select()
        .from("buildings", "b")
        .where("b.planetID = ?", planetID)
        .toString();

      // execute the query
      const [rows] = await Database.query(query);

      if (!InputValidator.isSet(rows)) {
        return null;
      }

      return SerializationHelper.toInstance(new Buildings(), JSON.stringify(rows[0]));
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  public async createBuildingsRow(planetID: number, connection = null) {
    const query = `INSERT INTO buildings (\`planetID\`) VALUES (${planetID});`;

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }
}
