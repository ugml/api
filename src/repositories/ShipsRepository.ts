import IShipsRepository from "../interfaces/repositories/IShipsRepository";
import Ships from "../units/Ships";
import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import * as squel from "safe-squel";

import { injectable } from "inversify";
import SerializationHelper from "../common/SerializationHelper";
import Buildings from "../units/Buildings";

@injectable()
export default class ShipsRepository implements IShipsRepository {
  public async create(t: Ships): Promise<Ships> {
    const query = squel
      .insert()
      .into("ships")
      .set("planetID", t.planetID)
      .toString();

    await Database.query(query);

    return t;
  }

  public async exists(id: number): Promise<boolean> {
    const query = squel
      .select()
      .from("ships")
      .where("planetID = ?", id)
      .toString();

    return InputValidator.isSet(await Database.query(query));
  }

  public async getById(id: number): Promise<Ships> {
    const query = squel
      .select()
      .from("ships")
      .where("planetID = ?", id)
      .toString();

    const [rows] = await Database.query(query);

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return SerializationHelper.toInstance(new Ships(), JSON.stringify(rows[0]));
  }

  public async save(t: Ships): Promise<void> {
    const query = squel
      .update()
      .table("planets")
      .set("smallCargoShip", t.smallCargoShip)
      .set("largeCargoShip", t.largeCargoShip)
      .set("lightFighter", t.lightFighter)
      .set("heavyFighter", t.heavyFighter)
      .set("cruiser", t.cruiser)
      .set("battleship", t.battleship)
      .set("colonyShip", t.colonyShip)
      .set("recycler", t.recycler)
      .set("espionageProbe", t.espionageProbe)
      .set("bomber", t.bomber)
      .set("solarSatellite", t.solarSatellite)
      .set("destroyer", t.destroyer)
      .set("battlecruiser", t.battlecruiser)
      .set("deathstar", t.deathstar)
      .where("planetID = ?", t.planetID)
      .toString();

    await Database.query(query);
  }

  public async getShips(planetID: number, userID: number): Promise<Ships> {
    const query: string = squel
      .select()
      .field("p.ownerID")
      .field("s.*")
      .from("ships", "s")
      .left_join("planets", "p", "s.planetID = p.planetID")
      .where("s.planetID = ?", planetID)
      .where("p.ownerID = ?", userID)
      .toString();

    const [[rows]] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return rows;
  }

  public async createTransactional(planetID: number, connection): Promise<void> {
    const query = squel
      .insert()
      .into("ships")
      .set("planetID", planetID)
      .toString();

    return await connection.query(query);
  }
}
