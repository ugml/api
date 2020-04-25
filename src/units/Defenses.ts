import IBuildableUnit from "../interfaces/IBuildableUnit";

/**
 * Represents a defenses-row in the database
 */
export default class Defenses implements IBuildableUnit {
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
}
