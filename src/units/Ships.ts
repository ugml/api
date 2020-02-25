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
   * The current amount of smallCargoShip
   */
  public smallCargoShip: number;

  /**
   * The current amount of largeCargoShip
   */
  public largeCargoShip: number;

  /**
   * The current amount of lightFighter
   */
  public lightFighter: number;

  /**
   * The current amount of heavyFighter
   */
  public heavyFighter: number;

  /**
   * The current amount of cruiser
   */
  public cruiser: number;

  /**
   * The current amount of battleship
   */
  public battleship: number;

  /**
   * The current amount of colonyShip
   */
  public colonyShip: number;

  /**
   * The current amount of recycler
   */
  public recycler: number;

  /**
   * The current amount of espionageProbe
   */
  public espionageProbe: number;

  /**
   * The current amount of bomber
   */
  public bomber: number;

  /**
   * The current amount of solarSatellite
   */
  public solarSatellite: number;

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
      0 <= this.smallCargoShip &&
      0 <= this.largeCargoShip &&
      0 <= this.lightFighter &&
      0 <= this.heavyFighter &&
      0 <= this.cruiser &&
      0 <= this.battleship &&
      0 <= this.colonyShip &&
      0 <= this.recycler &&
      0 <= this.espionageProbe &&
      0 <= this.bomber &&
      0 <= this.solarSatellite &&
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
  //       .set("smallCargoShip", this.smallCargoShip)
  //       .set("largeCargoShip", this.largeCargoShip)
  //       .set("lightFighter", this.lightFighter)
  //       .set("heavyFighter", this.heavyFighter)
  //       .set("cruiser", this.cruiser)
  //       .set("battleship", this.battleship)
  //       .set("colonyShip", this.colonyShip)
  //       .set("recycler", this.recycler)
  //       .set("espionageProbe", this.espionageProbe)
  //       .set("bomber", this.bomber)
  //       .set("solarSatellite", this.solarSatellite)
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
  //       .set("smallCargoShip", this.smallCargoShip)
  //       .set("largeCargoShip", this.largeCargoShip)
  //       .set("lightFighter", this.lightFighter)
  //       .set("heavyFighter", this.heavyFighter)
  //       .set("cruiser", this.cruiser)
  //       .set("battleship", this.battleship)
  //       .set("colonyShip", this.colonyShip)
  //       .set("recycler", this.recycler)
  //       .set("espionageProbe", this.espionageProbe)
  //       .set("bomber", this.bomber)
  //       .set("solarSatellite", this.solarSatellite)
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
