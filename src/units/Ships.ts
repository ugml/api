import IUnit from "../interfaces/IUnit";

export default class Ships implements IUnit {
  public planetID: number;

  public smallCargoShip: number;

  public largeCargoShip: number;

  public lightFighter: number;

  public heavyFighter: number;

  public cruiser: number;

  public battleship: number;

  public colonyShip: number;

  public recycler: number;

  public espionageProbe: number;

  public bomber: number;

  public solarSatellite: number;

  public destroyer: number;

  public battlecruiser: number;

  public deathstar: number;

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
