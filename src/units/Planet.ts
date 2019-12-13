import Config from "../common/Config";
import { Globals } from "../common/Globals";
import IUnits from "../interfaces/IUnits";
/**
 * Represents a planet-row in the database
 */
export default class Planet implements IUnits {
  /**
   * The ID of the planet
   */
  public planetID: number;

  /**
   * The ID of the owner
   */
  public ownerID: number;

  /**
   * The name of the planet
   */
  public name: string;

  /**
   * The galaxy-position in the universe
   */
  public pos_galaxy: number;

  /**
   * The system-position in the universe
   */
  public pos_system: number;

  /**
   * the planet-position in the universe
   */
  public pos_planet: number;

  /**
   * The unix-timestamp the planet was last updated
   */
  public last_update: number;

  /**
   * The type of the planet
   */
  public planet_type: Globals.PlanetType;

  /**
   * The image of the planet
   */
  public image: string;

  /**
   * The diameter of the planet
   */
  public diameter: number;

  /**
   * The currently populated fields on the planet
   */
  public fields_current: number;

  /**
   * The maximum fields on the planet
   */
  public fields_max: number;

  /**
   * The minimum temperature on the planet
   */
  public temp_min: number;

  /**
   * The maximum temperature on the planet
   */
  public temp_max: number;

  /**
   * The current amount of metal on the planet
   */
  public metal: number;

  /**
   * The current amount of crystal on the planet
   */
  public crystal: number;

  /**
   * The current amount of deuterium on the planet
   */
  public deuterium: number;

  /**
   * The current amount of energy used on the planet
   */
  public energy_used: number;

  /**
   * The maximum amount of energy on the planet
   */
  public energy_max: number;

  /**
   * The percentage of production metal-mine
   */
  public metal_mine_percent: number;

  /**
   * The percentage of production of the crystal-mine
   */
  public crystal_mine_percent: number;

  /**
   * The percentage of production deuterium-synthesizer
   */
  public deuterium_synthesizer_percent: number;

  /**
   * The percentage of production solar-planet
   */
  public solar_plant_percent: number;

  /**
   * The percentage of production fusion-reactor
   */
  public fusion_reactor_percent: number;

  /**
   * The percentage of production solar-sattelite
   */
  public solar_satellite_percent: number;

  /**
   * The ID of the building currently upgrading.
   * This value is 0 if no building is currently upgrading.
   */
  public b_building_id: number;

  /**
   * The time, at which the upgrade will be completed
   */
  public b_building_endtime: number;

  /**
   * True, if the current build-order is a demolition job
   */
  public b_building_demolition: boolean;

  /**
   * The curreny queue of the hangar
   */
  public b_hangar_queue: string;

  /**
   * The time, the queue was started
   */
  public b_hangar_start_time: number;

  // TODO: obsolete?
  /**
   * True, if the hangar is currently upgraded
   */
  public b_hangar_plus: boolean;

  /**
   * Indicates, if the planet is destroyed
   */
  public destroyed: boolean;

  /**
   * Checks, if the planet is currently upgrading a building
   */
  public isUpgradingBuilding(): boolean {
    return this.b_building_id > 0 && this.b_building_endtime > 0;
  }

  /**
   * Checks, if the planet is currently upgrading its hangar
   */
  public isUpgradingHangar(): boolean {
    return this.b_hangar_plus;
  }

  /**
   *  Checks, if the planet is currently upgrading the research-lab
   */
  public isUpgradingResearchLab(): boolean {
    return this.b_building_id === Globals.Buildings.RESEARCH_LAB && this.b_building_endtime > 0;
  }

  /**
   *  Checks, if the planet is currently building units
   */
  public isBuildingUnits(): boolean {
    return (
      this.b_hangar_queue !== undefined &&
      this.b_hangar_queue !== null &&
      this.b_hangar_queue.length > 0 &&
      this.b_hangar_start_time > 0
    );
  }

  /**
   * Returns, if the contains valid data or not
   */
  public isValid(): boolean {
    return (
      0 < this.planetID &&
      0 < this.ownerID &&
      5 <= this.name.length &&
      this.name.length < 45 &&
      0 < this.pos_galaxy &&
      this.pos_galaxy <= Config.getGameConfig().pos_galaxy_max &&
      0 < this.pos_system &&
      this.pos_system <= Config.getGameConfig().pos_system_max &&
      0 < this.pos_planet &&
      this.pos_planet <= Config.getGameConfig().pos_planet_max &&
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
      0 <= this.b_hangar_start_time
    );
  }
}
