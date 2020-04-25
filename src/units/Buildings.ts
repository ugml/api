import IBuildableUnit from "../interfaces/IBuildableUnit";

/**
 * Represents a buildings-row in the database
 */
export default class Buildings implements IBuildableUnit {
  public planetID: number;
  public metalMine: number;
  public crystalMine: number;
  public deuteriumSynthesizer: number;
  public solarPlant: number;
  public fusionReactor: number;
  public roboticFactory: number;
  public naniteFactory: number;
  public shipyard: number;
  public metalStorage: number;
  public crystalStorage: number;
  public deuteriumStorage: number;
  public researchLab: number;
  public terraformer: number;
  public allianceDepot: number;
  public missileSilo: number;

  public isValid(): boolean {
    return (
      0 <= this.planetID &&
      0 <= this.metalMine &&
      0 <= this.crystalMine &&
      0 <= this.deuteriumSynthesizer &&
      0 <= this.solarPlant &&
      0 <= this.fusionReactor &&
      0 <= this.roboticFactory &&
      0 <= this.naniteFactory &&
      0 <= this.shipyard &&
      0 <= this.metalStorage &&
      0 <= this.crystalStorage &&
      0 <= this.deuteriumStorage &&
      0 <= this.researchLab &&
      0 <= this.terraformer &&
      0 <= this.allianceDepot &&
      0 <= this.missileSilo
    );
  }
}
