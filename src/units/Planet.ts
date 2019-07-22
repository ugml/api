import { Config } from "../common/Config";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import { IUnits } from "../interfaces/IUnits";
import PlanetType = Globals.PlanetType;

export default class Planet implements IUnits {
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

  public isUpgradingBuilding(): boolean {
    return this.b_building_id > 0 && this.b_building_endtime > 0;
  }

  public isUpgradingHangar(): boolean {
    return this.b_hangar_plus;
  }

  public isUpgradingResearchLab(): boolean {
    return this.b_building_id === Globals.Buildings.RESEARCH_LAB && this.b_building_endtime > 0;
  }

  public isBuildingUnits(): boolean {
    return (
      this.b_hangar_queue !== undefined &&
      this.b_hangar_queue !== null &&
      this.b_hangar_queue.length > 0 &&
      this.b_hangar_start_time > 0
    );
  }

  public isResearching(): boolean {
    return this.b_tech_id > 0 && this.b_tech_endtime > 0;
  }

  public isValid(): boolean {
    return (
      0 < this.planetID &&
      0 < this.ownerID &&
      5 <= this.name.length &&
      this.name.length < 45 &&
      0 < this.galaxy &&
      this.galaxy <= Config.getGameConfig().pos_galaxy_max &&
      0 < this.system &&
      this.system <= Config.getGameConfig().pos_system_max &&
      0 < this.planet &&
      this.planet <= Config.getGameConfig().pos_planet_max &&
      0 < this.last_update &&
      0 < this.diameter &&
      0 <= this.fields_current &&
      0 < this.fields_max &&
      this.fields_current <= this.fields_max &&
      this.temp_min <= this.temp_max &&
      0 <= this.metal &&
      0 <= this.crystal &&
      0 <= this.deuterium &&
      0 <= this.energy_used &&
      0 <= this.energy_max &&
      0 <= this.metal_mine_percent &&
      this.metal_mine_percent <= 100 &&
      this.metal_mine_percent % 10 === 0 &&
      0 <= this.crystal_mine_percent &&
      this.crystal_mine_percent <= 100 &&
      this.crystal_mine_percent % 10 === 0 &&
      0 <= this.deuterium_synthesizer_percent &&
      this.deuterium_synthesizer_percent <= 100 &&
      this.deuterium_synthesizer_percent % 10 === 0 &&
      0 <= this.solar_plant_percent &&
      this.solar_plant_percent <= 100 &&
      this.solar_plant_percent % 10 === 0 &&
      0 <= this.fusion_reactor_percent &&
      this.fusion_reactor_percent <= 100 &&
      this.fusion_reactor_percent % 10 === 0 &&
      0 <= this.solar_satellite_percent &&
      this.solar_satellite_percent <= 100 &&
      this.solar_satellite_percent % 10 === 0 &&
      0 <= this.b_building_id &&
      0 <= this.b_building_endtime &&
      0 <= this.b_tech_id &&
      0 <= this.b_tech_endtime &&
      0 <= this.b_hangar_start_time
    );
  }
}
