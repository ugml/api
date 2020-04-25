import Config from "../common/Config";
import { Globals } from "../common/Globals";
import IUnit from "../interfaces/IUnit";
/**
 * Represents a planet-row in the database
 */
export default class Planet implements IUnit {
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
  public posGalaxy: number;

  /**
   * The system-position in the universe
   */
  public posSystem: number;

  /**
   * the planet-position in the universe
   */
  public posPlanet: number;

  /**
   * The unix-timestamp the planet was last updated
   */
  public lastUpdate: number;

  /**
   * The type of the planet
   */
  public planetType: Globals.PlanetType;

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
  public fieldsCurrent: number;

  /**
   * The maximum fields on the planet
   */
  public fieldsMax: number;

  /**
   * The minimum temperature on the planet
   */
  public tempMin: number;

  /**
   * The maximum temperature on the planet
   */
  public tempMax: number;

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
  public energyUsed: number;

  /**
   * The maximum amount of energy on the planet
   */
  public energyMax: number;

  /**
   * The percentage of production metal-mine
   */
  public metalMinePercent: number;

  /**
   * The percentage of production of the crystal-mine
   */
  public crystalMinePercent: number;

  /**
   * The percentage of production deuterium-synthesizer
   */
  public deuteriumSynthesizerPercent: number;

  /**
   * The percentage of production solar-planet
   */
  public solarPlantPercent: number;

  /**
   * The percentage of production fusion-reactor
   */
  public fusionReactorPercent: number;

  /**
   * The percentage of production solar-sattelite
   */
  public solarSatellitePercent: number;

  /**
   * The ID of the building currently upgrading.
   * This value is 0 if no building is currently upgrading.
   */
  public bBuildingId: number;

  /**
   * The time, at which the upgrade will be completed
   */
  public bBuildingEndTime: number;

  /**
   * True, if the current build-order is a demolition job
   */
  public bBuildingDemolition: boolean;

  /**
   * The curreny queue of the hangar
   */
  public bHangarQueue: string;

  /**
   * The time, the queue was started
   */
  public bHangarStartTime: number;

  // TODO: obsolete?
  /**
   * True, if the hangar is currently upgraded
   */
  public bHangarPlus: boolean;

  /**
   * Indicates, if the planet is destroyed
   */
  public destroyed: boolean;

  /**
   * Checks, if the planet is currently upgrading a building
   */
  public isUpgradingBuilding(): boolean {
    return this.bBuildingId > 0 && this.bBuildingEndTime > 0;
  }

  /**
   * Checks, if the planet is currently upgrading its hangar
   */
  public isUpgradingHangar(): boolean {
    return this.bHangarPlus;
  }

  /**
   *  Checks, if the planet is currently upgrading the research-lab
   */
  public isUpgradingResearchLab(): boolean {
    return this.bBuildingId === Globals.Buildings.RESEARCH_LAB && this.bBuildingEndTime > 0;
  }

  /**
   *  Checks, if the planet is currently building units
   */
  public isBuildingUnits(): boolean {
    return (
      this.bHangarQueue !== undefined &&
      this.bHangarQueue !== null &&
      this.bHangarQueue.length > 0 &&
      this.bHangarStartTime > 0
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
      0 < this.posGalaxy &&
      this.posGalaxy <= Config.getGameConfig().server.limits.galaxy.max &&
      0 < this.posSystem &&
      this.posSystem <= Config.getGameConfig().server.limits.system.max &&
      0 < this.posPlanet &&
      this.posPlanet <= Config.getGameConfig().server.limits.position.max &&
      0 < this.lastUpdate &&
      0 < this.diameter &&
      0 <= this.fieldsCurrent &&
      0 < this.fieldsMax &&
      this.fieldsCurrent <= this.fieldsMax &&
      this.tempMin <= this.tempMax &&
      0 <= this.metal &&
      0 <= this.crystal &&
      0 <= this.deuterium &&
      0 <= this.energyUsed &&
      0 <= this.energyMax &&
      0 <= this.metalMinePercent &&
      this.metalMinePercent <= 100 &&
      this.metalMinePercent % 10 === 0 &&
      0 <= this.crystalMinePercent &&
      this.crystalMinePercent <= 100 &&
      this.crystalMinePercent % 10 === 0 &&
      0 <= this.deuteriumSynthesizerPercent &&
      this.deuteriumSynthesizerPercent <= 100 &&
      this.deuteriumSynthesizerPercent % 10 === 0 &&
      0 <= this.solarPlantPercent &&
      this.solarPlantPercent <= 100 &&
      this.solarPlantPercent % 10 === 0 &&
      0 <= this.fusionReactorPercent &&
      this.fusionReactorPercent <= 100 &&
      this.fusionReactorPercent % 10 === 0 &&
      0 <= this.solarSatellitePercent &&
      this.solarSatellitePercent <= 100 &&
      this.solarSatellitePercent % 10 === 0 &&
      0 <= this.bBuildingId &&
      0 <= this.bBuildingEndTime &&
      0 <= this.bHangarStartTime
    );
  }
}
