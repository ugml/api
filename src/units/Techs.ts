import IUnit from "../interfaces/IUnit";
/**
 * Represents a techs-row in the database
 */
export default class Techs implements IUnit {
  /**
   * The ID of the user
   */
  public userID: number;

  /**
   * The current espionageTech level
   */
  public espionageTech: number;

  /**
   * The current computerTech level
   */
  public computerTech: number;

  /**
   * The current weaponTech level
   */
  public weaponTech: number;

  /**
   * The current armourTech level
   */
  public armourTech: number;

  /**
   * The current shieldingTech level
   */
  public shieldingTech: number;

  /**
   * The current energyTech level
   */
  public energyTech: number;

  /**
   * The current hyperspaceTech level
   */
  public hyperspaceTech: number;

  /**
   * The current combustionDriveTech level
   */
  public combustionDriveTech: number;

  /**
   * The current impulseDriveTech level
   */
  public impulseDriveTech: number;

  /**
   * The current hyperspaceDriveTech level
   */
  public hyperspaceDriveTech: number;

  /**
   * The current laserTech level
   */
  public laserTech: number;

  /**
   * The current ionTech level
   */
  public ionTech: number;

  /**
   * The current plasmaTech level
   */
  public plasmaTech: number;

  /**
   * The current intergalacticResearchTech level
   */
  public intergalacticResearchTech: number;

  /**
   * The current gravitonTech level
   */
  public gravitonTech: number;

  /**
   * Returns, if the contains valid data or not
   */
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

  // public save(): Promise<{}> {
  //   return new Promise((resolve, reject) => {
  //     const query = squel
  //       .update()
  //       .table("techs")
  //       .set("espionageTech", this.espionageTech)
  //       .set("computerTech", this.computerTech)
  //       .set("weaponTech", this.weaponTech)
  //       .set("armourTech", this.armourTech)
  //       .set("shieldingTech", this.shieldingTech)
  //       .set("energyTech", this.energyTech)
  //       .set("hyperspaceTech", this.hyperspaceTech)
  //       .set("combustionDriveTech", this.combustionDriveTech)
  //       .set("impulseDriveTech", this.impulseDriveTech)
  //       .set("hyperspaceDriveTech", this.hyperspaceDriveTech)
  //       .set("laserTech", this.laserTech)
  //       .set("ionTech", this.ionTech)
  //       .set("plasmaTech", this.plasmaTech)
  //       .set("intergalacticResearchTech", this.intergalacticResearchTech)
  //       .set("gravitonTech", this.gravitonTech)
  //       .where("userID = ?", this.userID)
  //       .toString();
  //
  //     Database.query(query)
  //       .then(() => {
  //         return resolve(this);
  //       })
  //       .catch(error => {
  //         Logger.error(error);
  //         return reject(error);
  //       });
  //   });
  // }
  //
  // public create(): Promise<{}> {
  //   return new Promise((resolve, reject) => {
  //     const query = squel
  //       .insert()
  //       .into("techs")
  //       .set("userID", this.userID)
  //       .set("espionageTech", this.espionageTech)
  //       .set("computerTech", this.computerTech)
  //       .set("weaponTech", this.weaponTech)
  //       .set("armourTech", this.armourTech)
  //       .set("shieldingTech", this.shieldingTech)
  //       .set("energyTech", this.energyTech)
  //       .set("hyperspaceTech", this.hyperspaceTech)
  //       .set("combustionDriveTech", this.combustionDriveTech)
  //       .set("impulseDriveTech", this.impulseDriveTech)
  //       .set("hyperspaceDriveTech", this.hyperspaceDriveTech)
  //       .set("laserTech", this.laserTech)
  //       .set("ionTech", this.ionTech)
  //       .set("plasmaTech", this.plasmaTech)
  //       .set("intergalacticResearchTech", this.intergalacticResearchTech)
  //       .set("gravitonTech", this.gravitonTech)
  //       .toString();
  //
  //     Database.query(query)
  //       .then(() => {
  //         return resolve(this);
  //       })
  //       .catch(error => {
  //         Logger.error(error);
  //         return reject(error);
  //       });
  //   });
  // }
}
