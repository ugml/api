import IUnits from "../interfaces/IUnits";
/**
 * Represents a defenses-row in the database
 */
export default class Defenses implements IUnits {
  /**
   * The ID of the planet
   */
  public planetID: number;

  /**
   * The current amount of rocket_launcher on the planet
   */
  public rocket_launcher: number;

  /**
   * The current amount of light_laser on the planet
   */
  public light_laser: number;

  /**
   * The current amount of heavy_laser on the planet
   */
  public heavy_laser: number;

  /**
   * The current amount of ion_cannon on the planet
   */
  public ion_cannon: number;

  /**
   * The current amount of gauss_cannon on the planet
   */
  public gauss_cannon: number;

  /**
   * The current amount of plasma_turret on the planet
   */
  public plasma_turret: number;

  /**
   * Is true, if the planet has a small_shield_dome
   */
  public small_shield_dome: boolean;

  /**
   * Is true, if the planet has a large_shield_dome
   */
  public large_shield_dome: boolean;

  /**
   * The current amount of anti_ballistic_missile on the planet
   */
  public anti_ballistic_missile: number;

  /**
   * The current amount of interplanetary_missile on the planet
   */
  public interplanetary_missile: number;

  /**
   * Returns, if the contains valid data or not
   */
  public isValid(): boolean {
    return (
      0 <= this.planetID &&
      0 <= this.rocket_launcher &&
      0 <= this.light_laser &&
      0 <= this.heavy_laser &&
      0 <= this.ion_cannon &&
      0 <= this.gauss_cannon &&
      0 <= this.plasma_turret &&
      0 <= this.anti_ballistic_missile &&
      0 <= this.interplanetary_missile
    );
  }

  // public save(): Promise<{}> {
  //   return new Promise((resolve, reject) => {
  //     const query = squel
  //       .update()
  //       .table("defenses")
  //       .set("rocket_launcher", this.rocket_launcher)
  //       .set("light_laser", this.light_laser)
  //       .set("heavy_laser", this.heavy_laser)
  //       .set("ion_cannon", this.ion_cannon)
  //       .set("gauss_cannon", this.gauss_cannon)
  //       .set("plasma_turret", this.plasma_turret)
  //       .set("small_shield_dome", this.small_shield_dome)
  //       .set("large_shield_dome", this.large_shield_dome)
  //       .set("anti_ballistic_missile", this.anti_ballistic_missile)
  //       .set("interplanetary_missile", this.interplanetary_missile)
  //       .where("planetID = ?", this.planetID)
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
  //       .into("defenses")
  //       .set("planetID", this.planetID)
  //       .set("rocket_launcher", this.rocket_launcher)
  //       .set("light_laser", this.light_laser)
  //       .set("heavy_laser", this.heavy_laser)
  //       .set("ion_cannon", this.ion_cannon)
  //       .set("gauss_cannon", this.gauss_cannon)
  //       .set("plasma_turret", this.plasma_turret)
  //       .set("small_shield_dome", this.small_shield_dome)
  //       .set("large_shield_dome", this.large_shield_dome)
  //       .set("anti_ballistic_missile", this.anti_ballistic_missile)
  //       .set("interplanetary_missile", this.interplanetary_missile)
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
