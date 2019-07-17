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
  public fields_current: number;
  public fields_max: number;
  public temp_min: number;
  public temp_max: number;
  public metal: number;
  public crystal: number;
  public deuterium: number;
  public energy_used: number;
  public energy_max: number;
  public metal_mine_percent: number;
  public crystal_mine_percent: number;
  public deuterium_synthesizer_percent: number;
  public solar_plant_percent: number;
  public fusion_reactor_percent: number;
  public solar_satellite_percent: number;
  public b_building_id: number;
  public b_building_endtime: number;
  public b_tech_id: number;
  public b_tech_endtime: number;
  public b_hangar_queue: string;
  public b_hangar_start_time: number;
  public b_hangar_plus: boolean = false;
  public destroyed: boolean = false;

  public isValid(): boolean {
    // TODO
    return false;
  }
}

export { Planet, PlanetType };
