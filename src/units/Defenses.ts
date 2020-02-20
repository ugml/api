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
   * The current amount of rocketLauncher on the planet
   */
  public rocketLauncher: number;

  /**
   * The current amount of lightLaser on the planet
   */
  public lightLaser: number;

  /**
   * The current amount of heavyLaser on the planet
   */
  public heavyLaser: number;

  /**
   * The current amount of ionCannon on the planet
   */
  public ionCannon: number;

  /**
   * The current amount of gaussCannon on the planet
   */
  public gaussCannon: number;

  /**
   * The current amount of plasmaTurret on the planet
   */
  public plasmaTurret: number;

  /**
   * Is true, if the planet has a smallShieldDome
   */
  public smallShieldDome: boolean;

  /**
   * Is true, if the planet has a largeShieldDome
   */
  public largeShieldDome: boolean;

  /**
   * The current amount of antiBallisticMissile on the planet
   */
  public antiBallisticMissile: number;

  /**
   * The current amount of interplanetaryMissile on the planet
   */
  public interplanetaryMissile: number;

  /**
   * Returns, if the contains valid data or not
   */
  public isValid(): boolean {
    return (
      0 <= this.planetID &&
      0 <= this.rocketLauncher &&
      0 <= this.lightLaser &&
      0 <= this.heavyLaser &&
      0 <= this.ionCannon &&
      0 <= this.gaussCannon &&
      0 <= this.plasmaTurret &&
      0 <= this.antiBallisticMissile &&
      0 <= this.interplanetaryMissile
    );
  }

  // public save(): Promise<{}> {
  //   return new Promise((resolve, reject) => {
  //     const query = squel
  //       .update()
  //       .table("defenses")
  //       .set("rocketLauncher", this.rocketLauncher)
  //       .set("lightLaser", this.lightLaser)
  //       .set("heavyLaser", this.heavyLaser)
  //       .set("ionCannon", this.ionCannon)
  //       .set("gaussCannon", this.gaussCannon)
  //       .set("plasmaTurret", this.plasmaTurret)
  //       .set("smallShieldDome", this.smallShieldDome)
  //       .set("largeShieldDome", this.largeShieldDome)
  //       .set("antiBallisticMissile", this.antiBallisticMissile)
  //       .set("interplanetaryMissile", this.interplanetaryMissile)
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
  //       .set("rocketLauncher", this.rocketLauncher)
  //       .set("lightLaser", this.lightLaser)
  //       .set("heavyLaser", this.heavyLaser)
  //       .set("ionCannon", this.ionCannon)
  //       .set("gaussCannon", this.gaussCannon)
  //       .set("plasmaTurret", this.plasmaTurret)
  //       .set("smallShieldDome", this.smallShieldDome)
  //       .set("largeShieldDome", this.largeShieldDome)
  //       .set("antiBallisticMissile", this.antiBallisticMissile)
  //       .set("interplanetaryMissile", this.interplanetaryMissile)
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
