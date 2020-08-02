import IUnit from "../interfaces/IUnit";

export default class Defenses implements IUnit {
  public planetID: number;

  public rocketLauncher: number;

  public lightLaser: number;

  public heavyLaser: number;

  public ionCannon: number;

  public gaussCannon: number;

  public plasmaTurret: number;

  public smallShieldDome: boolean;

  public largeShieldDome: boolean;

  public antiBallisticMissile: number;

  public interplanetaryMissile: number;

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
