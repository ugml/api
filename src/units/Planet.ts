import { Database } from "../common/Database";
import { IUnits } from "../interfaces/IUnits";

import squel = require("squel");
import { Logger } from "../common/Logger";

enum PlanetType {
  Planet = 1,
  Moon = 2,
}

class Planet implements IUnits {
  public planetID: number;
  public ownerID: number;
  public name: string;
  public galaxy: number;
  public system: number;
  public planet: number;
  public last_update: number;
  public planet_type: PlanetType;
  public image: string;
  public diameter: number;
  public fields_current: number = 0;
  public fields_max: number = 0;
  public temp_min: number = 0;
  public temp_max: number = 0;
  public metal: number = 0;
  public crystal: number = 0;
  public deuterium: number = 0;
  public energy_used: number = 0;
  public energy_max: number = 0;
  public metal_mine_percent: number = 100;
  public crystal_mine_percent: number = 100;
  public deuterium_synthesizer_percent: number = 100;
  public solar_plant_percent: number = 100;
  public fusion_reactor_percent: number = 100;
  public solar_satellite_percent: number = 100;
  public b_building_id: number = 0;
  public b_building_endtime: number = 0;
  public b_tech_id: number = 0;
  public b_tech_endtime: number = 0;
  public b_hangar_id: number = 0;
  public b_hangar_start_time: number = 0;
  public b_hangar_plus: boolean = false;
  public destroyed: boolean = false;

  public save(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const query = squel
        .update()
        .table("planets")
        .set("name", this.name)
        .set("galaxy", this.galaxy)
        .set("system", this.system)
        .set("planet", this.planet)
        .set("last_update", this.last_update)
        .set("fields_current", this.fields_current)
        .set("fields_max", this.fields_max)
        .set("metal", this.metal)
        .set("crystal", this.crystal)
        .set("deuterium", this.deuterium)
        .set("energy_used", this.energy_used)
        .set("energy_max", this.energy_max)
        .set("metal_mine_percent", this.metal_mine_percent)
        .set("crystal_mine_percent", this.crystal_mine_percent)
        .set("deuterium_synthesizer_percent", this.deuterium_synthesizer_percent)
        .set("solar_plant_percent", this.solar_plant_percent)
        .set("fusion_reactor_percent", this.fusion_reactor_percent)
        .set("solar_satellite_percent", this.solar_satellite_percent)
        .set("b_building_id", this.b_building_id)
        .set("b_building_endtime", this.b_building_endtime)
        .set("b_tech_id", this.b_tech_id)
        .set("b_tech_endtime", this.b_tech_endtime)
        .set("b_hangar_id", this.b_hangar_id)
        .set("b_hangar_start_time", this.b_hangar_start_time)
        .set("b_hangar_plus", this.b_hangar_plus)
        .set("destroyed", this.destroyed)
        .where("planetID = ?", this.planetID)
        .toString();

      Database.getConnectionPool()
        .query(query)
        .then(() => {
          return resolve(this);
        })
        .catch(error => {
          Logger.error(error);
          return reject(error);
        });
    });
  }

  public async create(connection = null): Promise<{}> {
    const query = squel
      .insert()
      .into("planets")
      .set("planetID", this.planetID)
      .set("ownerID", this.ownerID)
      .set("name", this.name)
      .set("galaxy", this.galaxy)
      .set("system", this.system)
      .set("planet", this.planet)
      .set("last_update", this.last_update)
      .set("planet_type", this.planet_type)
      .set("image", this.image)
      .set("diameter", this.diameter)
      .set("fields_current", this.fields_current)
      .set("fields_max", this.fields_max)
      .set("temp_min", this.temp_min)
      .set("temp_max", this.temp_max)
      .set("metal", this.metal)
      .set("crystal", this.crystal)
      .set("deuterium", this.deuterium)
      .set("energy_used", this.energy_used)
      .set("energy_max", this.energy_max)
      .set("metal_mine_percent", this.metal_mine_percent)
      .set("crystal_mine_percent", this.crystal_mine_percent)
      .set("deuterium_synthesizer_percent", this.deuterium_synthesizer_percent)
      .set("solar_plant_percent", this.solar_plant_percent)
      .set("fusion_reactor_percent", this.fusion_reactor_percent)
      .set("solar_satellite_percent", this.solar_satellite_percent)
      .set("b_building_id", this.b_building_id)
      .set("b_building_endtime", this.b_building_endtime)
      .set("b_tech_id", this.b_tech_id)
      .set("b_tech_endtime", this.b_tech_endtime)
      .set("b_hangar_id", this.b_hangar_id)
      .set("b_hangar_start_time", this.b_hangar_start_time)
      .set("b_hangar_plus", this.b_hangar_plus)
      .set("destroyed", this.destroyed)
      .toString();

    if (connection === null) {
      return await Database.getConnectionPool().query(query);
    } else {
      return await connection.query(query);
    }
  }

  public isValid(): boolean {
    return false;
  }
}

export { Planet, PlanetType };
