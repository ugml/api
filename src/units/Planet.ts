import Config from "../common/Config";
import { Globals } from "../common/Globals";
import IUnit from "../interfaces/IUnit";
import ICosts from "../interfaces/ICosts";

/**
 * Represents a planet-row in the database
 */
export default class Planet implements IUnit {
  public planetID: number;
  public ownerID: number;
  public name: string;
  public posGalaxy: number;
  public posSystem: number;
  public posPlanet: number;

  /**
   * The UNIX-timestamp the planet was last updated
   */
  public lastUpdate: number;
  public planetType: Globals.PlanetType;
  public image: string;
  public diameter: number;
  public fieldsCurrent: number;
  public fieldsMax: number;
  public tempMin: number;
  public tempMax: number;
  public metal: number;
  public crystal: number;
  public deuterium: number;
  public energyUsed: number;
  public energyMax: number;
  public metalMinePercent: number;
  public crystalMinePercent: number;
  public deuteriumSynthesizerPercent: number;
  public solarPlantPercent: number;
  public fusionReactorPercent: number;
  public solarSatellitePercent: number;

  /**
   * The ID of the building currently upgrading.
   * This value is 0 if no building is currently upgrading.
   */
  public bBuildingId: number;
  public bBuildingEndTime: number;

  /**
   * True, if the current build-order is a demolition job
   */
  public bBuildingDemolition: boolean;
  public bHangarQueue: string;
  public bHangarStartTime: number;
  public bHangarPlus: boolean; // TODO: obsolete?
  public destroyed: boolean;

  public isUpgradingBuilding(): boolean {
    return this.bBuildingId > 0 && this.bBuildingEndTime > 0;
  }

  public isUpgradingHangar(): boolean {
    return this.bHangarPlus;
  }

  public isUpgradingResearchLab(): boolean {
    return this.bBuildingId === Globals.Buildings.RESEARCH_LAB && this.bBuildingEndTime > 0;
  }

  public isBuildingUnits(): boolean {
    return (
      this.bHangarQueue !== undefined &&
      this.bHangarQueue !== null &&
      this.bHangarQueue.length > 0 &&
      this.bHangarStartTime > 0
    );
  }

  public hasEnoughResources(cost: ICosts): boolean {
    return (
      this.metal >= cost.metal &&
      this.crystal >= cost.crystal &&
      this.deuterium >= cost.deuterium &&
      this.energyUsed >= cost.energy
    );
  }

  public substractCosts(cost: ICosts) {
    this.metal = this.metal - cost.metal;
    this.crystal = this.crystal - cost.crystal;
    this.deuterium = this.deuterium - cost.deuterium;
  }

  public cancelBuilding(): void {
    this.bBuildingId = 0;
    this.bBuildingEndTime = 0;
  }

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
