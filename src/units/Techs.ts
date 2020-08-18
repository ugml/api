import IUnit from "../interfaces/IUnit";

export default class Techs implements IUnit {
  public userID: number;

  public espionageTech: number;

  public computerTech: number;

  public weaponTech: number;

  public armourTech: number;

  public shieldingTech: number;

  public energyTech: number;

  public hyperspaceTech: number;

  public combustionDriveTech: number;

  public impulseDriveTech: number;

  public hyperspaceDriveTech: number;

  public laserTech: number;

  public ionTech: number;

  public plasmaTech: number;

  public intergalacticResearchTech: number;

  public gravitonTech: number;

  public isValid(): boolean {
    return (
      0 < this.userID &&
      0 <= this.espionageTech &&
      0 <= this.computerTech &&
      0 <= this.weaponTech &&
      0 <= this.armourTech &&
      0 <= this.shieldingTech &&
      0 <= this.energyTech &&
      0 <= this.hyperspaceTech &&
      0 <= this.combustionDriveTech &&
      0 <= this.impulseDriveTech &&
      0 <= this.hyperspaceDriveTech &&
      0 <= this.laserTech &&
      0 <= this.ionTech &&
      0 <= this.plasmaTech &&
      0 <= this.intergalacticResearchTech &&
      0 <= this.gravitonTech
    );
  }
}
