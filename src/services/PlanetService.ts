import { Database } from "../common/Database";
import { InputValidator } from "../common/InputValidator";
import { Logger } from "../common/Logger";
import { SerializationHelper } from "../common/SerializationHelper";
import { Planet } from "../units/Planet";
import { User } from "../units/User";

import squel = require("squel");

export class PlanetService {
  public static async getPlanet(userID: number, planetID: number): Promise<Planet> {
    const query: string = squel
      .select()
      .from("planets", "p")
      .where("p.planetID = ?", planetID)
      .where("p.ownerID = ?", userID)
      .toString();

    // execute the query
    let [rows] = await Database.query(query);

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return SerializationHelper.toInstance(new Planet(), JSON.stringify(rows[0]));
  }

  public static async updatePlanet(planet: Planet): Promise<boolean> {
    try {
      const query = squel
        .update()
        .table("planets")
        .set("name", planet.name)
        .set("last_update", planet.last_update)
        .set("fields_current", planet.fields_current)
        .set("fields_max", planet.fields_max)
        .set("metal", planet.metal)
        .set("crystal", planet.crystal)
        .set("deuterium", planet.deuterium)
        .set("energy_used", planet.energy_used)
        .set("energy_max", planet.energy_max)
        .set("metal_mine_percent", planet.metal_mine_percent)
        .set("crystal_mine_percent", planet.crystal_mine_percent)
        .set("deuterium_synthesizer_percent", planet.deuterium_synthesizer_percent)
        .set("solar_plant_percent", planet.solar_plant_percent)
        .set("fusion_reactor_percent", planet.fusion_reactor_percent)
        .set("solar_satellite_percent", planet.solar_satellite_percent)
        .set("b_building_id", planet.b_building_id)
        .set("b_building_endtime", planet.b_building_endtime)
        .set("b_tech_id", planet.b_tech_id)
        .set("b_tech_endtime", planet.b_tech_endtime)
        .set("b_hangar_id", planet.b_hangar_id)
        .set("b_hangar_start_time", planet.b_hangar_start_time)
        .set("b_hangar_plus", planet.b_hangar_plus)
        .set("destroyed", planet.destroyed)
        .where("planetID = ?", planet.planetID)
        .toString();

      await Database.query(query);

      return true;
    } catch (error) {
      Logger.error(error);

      return false;
    }
  }

  public static async getNewId(): Promise<number> {
    const query = "CALL getNewPlanetId();";

    const [[[result]]] = await Database.query(query);

    return result.planetID;
  }

  /***
   * Stores the current object in the database
   */
  public static async createNewPlanet(planet: Planet, connection) {
    const query = squel
      .insert()
      .into("planets")
      .set("planetID", planet.planetID)
      .set("ownerID", planet.ownerID)
      .set("name", planet.name)
      .set("galaxy", planet.galaxy)
      .set("system", planet.system)
      .set("planet", planet.planet)
      .set("last_update", planet.last_update)
      .set("planet_type", planet.planet_type)
      .set("image", planet.image)
      .set("diameter", planet.diameter)
      .set("fields_max", planet.fields_max)
      .set("temp_min", planet.temp_min)
      .set("temp_max", planet.temp_max)
      .set("metal", planet.metal)
      .set("crystal", planet.crystal)
      .set("deuterium", planet.deuterium)
      .toString();

    if (connection === null) {
      return await Database.query(query);
    } else {
      return await connection.query(query);
    }
  }
}
