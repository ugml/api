import IUnits from "../interfaces/IUnits";
/**
 * Represents a ships-row in the database
 */
export default class Ships implements IUnits {
  /**
   * The ID of the planet
   */
  public planetID: number;

  /**
   * The current amount of small_cargo_ship
   */
  public small_cargo_ship: number;

  /**
   * The current amount of large_cargo_ship
   */
  public large_cargo_ship: number;

  /**
   * The current amount of light_fighter
   */
  public light_fighter: number;

  /**
   * The current amount of heavy_fighter
   */
  public heavy_fighter: number;

  /**
   * The current amount of cruiser
   */
  public cruiser: number;

  /**
   * The current amount of battleship
   */
  public battleship: number;

  /**
   * The current amount of colony_ship
   */
  public colony_ship: number;

  /**
   * The current amount of recycler
   */
  public recycler: number;

  /**
   * The current amount of espionage_probe
   */
  public espionage_probe: number;

  /**
   * The current amount of bomber
   */
  public bomber: number;

  /**
   * The current amount of solar_satellite
   */
  public solar_satellite: number;

  /**
   * The current amount of destroyer
   */
  public destroyer: number;

  /**
   * The current amount of battlecruiser
   */
  public battlecruiser: number;

  /**
   * The current amount of deathstar
   */
  public deathstar: number;

  /**
   * Returns, if the contains valid data or not
   */
  public isValid(): boolean {
    return (
      0 < this.planetID &&
      0 <= this.small_cargo_ship &&
      0 <= this.large_cargo_ship &&
      0 <= this.light_fighter &&
      0 <= this.heavy_fighter &&
      0 <= this.cruiser &&
      0 <= this.battleship &&
      0 <= this.colony_ship &&
      0 <= this.recycler &&
      0 <= this.espionage_probe &&
      0 <= this.bomber &&
      0 <= this.solar_satellite &&
      0 <= this.destroyer &&
      0 <= this.battlecruiser &&
      0 <= this.deathstar
    );
  }

  // public save(): Promise<{}> {
  //   return new Promise((resolve, reject) => {
  //     const query = squel
  //       .update()
  //       .table("ships")
  //       .set("small_cargo_ship", this.small_cargo_ship)
  //       .set("large_cargo_ship", this.large_cargo_ship)
  //       .set("light_fighter", this.light_fighter)
  //       .set("heavy_fighter", this.heavy_fighter)
  //       .set("cruiser", this.cruiser)
  //       .set("battleship", this.battleship)
  //       .set("colony_ship", this.colony_ship)
  //       .set("recycler", this.recycler)
  //       .set("espionage_probe", this.espionage_probe)
  //       .set("bomber", this.bomber)
  //       .set("solar_satellite", this.solar_satellite)
  //       .set("destroyer", this.destroyer)
  //       .set("battlecruiser", this.battlecruiser)
  //       .set("deathstar", this.deathstar)
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
  //       .into("ships")
  //       .set("planetID", this.planetID)
  //       .set("small_cargo_ship", this.small_cargo_ship)
  //       .set("large_cargo_ship", this.large_cargo_ship)
  //       .set("light_fighter", this.light_fighter)
  //       .set("heavy_fighter", this.heavy_fighter)
  //       .set("cruiser", this.cruiser)
  //       .set("battleship", this.battleship)
  //       .set("colony_ship", this.colony_ship)
  //       .set("recycler", this.recycler)
  //       .set("espionage_probe", this.espionage_probe)
  //       .set("bomber", this.bomber)
  //       .set("solar_satellite", this.solar_satellite)
  //       .set("destroyer", this.destroyer)
  //       .set("battlecruiser", this.battlecruiser)
  //       .set("deathstar", this.deathstar)
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
