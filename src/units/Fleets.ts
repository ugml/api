import { Database } from "../common/Database";
import { IUnits } from "../interfaces/IUnits";

import squel = require("squel");
import { Logger } from "../common/Logger";

class Fleets implements IUnits {
  public planetID: number;
  public small_cargo_ship: number;
  public large_cargo_ship: number;
  public light_fighter: number;
  public heavy_fighter: number;
  public cruiser: number;
  public battleship: number;
  public colony_ship: boolean;
  public recycler: boolean;
  public espionage_probe: number;
  public bomber: number;
  public solar_satellite: number;
  public destroyer: number;
  public battlecruiser: number;
  public deathstar: number;

  public save(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const query = squel
        .update()
        .table("fleets")
        .set("small_cargo_ship", this.small_cargo_ship)
        .set("large_cargo_ship", this.large_cargo_ship)
        .set("light_fighter", this.light_fighter)
        .set("heavy_fighter", this.heavy_fighter)
        .set("cruiser", this.cruiser)
        .set("battleship", this.battleship)
        .set("colony_ship", this.colony_ship)
        .set("recycler", this.recycler)
        .set("espionage_probe", this.espionage_probe)
        .set("bomber", this.bomber)
        .set("solar_satellite", this.solar_satellite)
        .set("destroyer", this.destroyer)
        .set("battlecruiser", this.battlecruiser)
        .set("deathstar", this.deathstar)
        .where("planetID = ?", this.planetID)
        .toString();

      Database.getConnectionPool()
        .query(query)
        .then(() => {
          return resolve(this);
        })
        .catch(error => {
          Logger.error(error);
          return reject(error);
        });
    });
  }

  public create(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const query = squel
        .insert()
        .into("fleets")
        .set("planetID", this.planetID)
        .set("small_cargo_ship", this.small_cargo_ship)
        .set("large_cargo_ship", this.large_cargo_ship)
        .set("light_fighter", this.light_fighter)
        .set("heavy_fighter", this.heavy_fighter)
        .set("cruiser", this.cruiser)
        .set("battleship", this.battleship)
        .set("colony_ship", this.colony_ship)
        .set("recycler", this.recycler)
        .set("espionage_probe", this.espionage_probe)
        .set("bomber", this.bomber)
        .set("solar_satellite", this.solar_satellite)
        .set("destroyer", this.destroyer)
        .set("battlecruiser", this.battlecruiser)
        .set("deathstar", this.deathstar)
        .toString();

      Database.getConnectionPool()
        .query(query)
        .then(() => {
          return resolve(this);
        })
        .catch(error => {
          Logger.error(error);
          return reject(error);
        });
    });
  }

  public isValid(): boolean {
    return false;
  }
}

export { Fleets };
