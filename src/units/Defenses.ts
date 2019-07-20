import { IUnits } from "../interfaces/IUnits";

export default class Defenses implements IUnits {
  public planetID: number;
  public rocket_launcher: number;
  public light_laser: number;
  public heavy_laser: number;
  public ion_cannon: number;
  public gauss_cannon: number;
  public plasma_turret: number;
  public small_shield_dome: boolean;
  public large_shield_dome: boolean;
  public anti_ballistic_missile: number;
  public interplanetary_missile: number;

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

  public isValid(): boolean {
    return false;
  }
}
