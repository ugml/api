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
    // TODO
    return false;
  }
}
