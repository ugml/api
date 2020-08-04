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
}
