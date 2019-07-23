import IUnits from "../interfaces/IUnits";
/**
 * Represents a techs-row in the database
 */
export default class Techs implements IUnits {
  /**
   * The ID of the user
   */
  public userID: number;

  /**
   * The current espionage_tech level
   */
  public espionage_tech: number;

  /**
   * The current computer_tech level
   */
  public computer_tech: number;

  /**
   * The current weapon_tech level
   */
  public weapon_tech: number;

  /**
   * The current armour_tech level
   */
  public armour_tech: number;

  /**
   * The current shielding_tech level
   */
  public shielding_tech: number;

  /**
   * The current energy_tech level
   */
  public energy_tech: number;

  /**
   * The current hyperspace_tech level
   */
  public hyperspace_tech: number;

  /**
   * The current combustion_drive_tech level
   */
  public combustion_drive_tech: number;

  /**
   * The current impulse_drive_tech level
   */
  public impulse_drive_tech: number;

  /**
   * The current hyperspace_drive_tech level
   */
  public hyperspace_drive_tech: number;

  /**
   * The current laser_tech level
   */
  public laser_tech: number;

  /**
   * The current ion_tech level
   */
  public ion_tech: number;

  /**
   * The current plasma_tech level
   */
  public plasma_tech: number;

  /**
   * The current intergalactic_research_tech level
   */
  public intergalactic_research_tech: number;

  /**
   * The current graviton_tech level
   */
  public graviton_tech: number;

  /**
   * Returns, if the contains valid data or not
   */
  public isValid(): boolean {
    return (
      0 < this.userID &&
      0 <= this.espionage_tech &&
      0 <= this.computer_tech &&
      0 <= this.weapon_tech &&
      0 <= this.armour_tech &&
      0 <= this.shielding_tech &&
      0 <= this.energy_tech &&
      0 <= this.hyperspace_tech &&
      0 <= this.combustion_drive_tech &&
      0 <= this.impulse_drive_tech &&
      0 <= this.hyperspace_drive_tech &&
      0 <= this.laser_tech &&
      0 <= this.ion_tech &&
      0 <= this.plasma_tech &&
      0 <= this.intergalactic_research_tech &&
      0 <= this.graviton_tech
    );
  }

  // public save(): Promise<{}> {
  //   return new Promise((resolve, reject) => {
  //     const query = squel
  //       .update()
  //       .table("techs")
  //       .set("espionage_tech", this.espionage_tech)
  //       .set("computer_tech", this.computer_tech)
  //       .set("weapon_tech", this.weapon_tech)
  //       .set("armour_tech", this.armour_tech)
  //       .set("shielding_tech", this.shielding_tech)
  //       .set("energy_tech", this.energy_tech)
  //       .set("hyperspace_tech", this.hyperspace_tech)
  //       .set("combustion_drive_tech", this.combustion_drive_tech)
  //       .set("impulse_drive_tech", this.impulse_drive_tech)
  //       .set("hyperspace_drive_tech", this.hyperspace_drive_tech)
  //       .set("laser_tech", this.laser_tech)
  //       .set("ion_tech", this.ion_tech)
  //       .set("plasma_tech", this.plasma_tech)
  //       .set("intergalactic_research_tech", this.intergalactic_research_tech)
  //       .set("graviton_tech", this.graviton_tech)
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
  //       .set("espionage_tech", this.espionage_tech)
  //       .set("computer_tech", this.computer_tech)
  //       .set("weapon_tech", this.weapon_tech)
  //       .set("armour_tech", this.armour_tech)
  //       .set("shielding_tech", this.shielding_tech)
  //       .set("energy_tech", this.energy_tech)
  //       .set("hyperspace_tech", this.hyperspace_tech)
  //       .set("combustion_drive_tech", this.combustion_drive_tech)
  //       .set("impulse_drive_tech", this.impulse_drive_tech)
  //       .set("hyperspace_drive_tech", this.hyperspace_drive_tech)
  //       .set("laser_tech", this.laser_tech)
  //       .set("ion_tech", this.ion_tech)
  //       .set("plasma_tech", this.plasma_tech)
  //       .set("intergalactic_research_tech", this.intergalactic_research_tech)
  //       .set("graviton_tech", this.graviton_tech)
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
