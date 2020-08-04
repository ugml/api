import IDefenseRepository from "../interfaces/repositories/IDefenseRepository";
import Defenses from "../units/Defenses";
import * as squel from "safe-squel";
import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import { injectable } from "inversify";

@injectable()
export default class DefenseRepository implements IDefenseRepository {
  public async exists(id: number): Promise<boolean> {
    const query: string = squel
      .select()
      .field("p.ownerID", "ownerID")
      .field("d.*")
      .from("defenses", "d")
      .left_join("planets", "p", "d.planetID = p.planetID")
      .where("d.planetID = ?", id)
      .toString();

    const [[rows]] = await Database.query(query);

    return InputValidator.isSet(rows);
  }

  public async getById(id: number): Promise<Defenses> {
    const query: string = squel
      .select()
      .field("p.ownerID", "ownerID")
      .field("d.*")
      .from("defenses", "d")
      .left_join("planets", "p", "d.planetID = p.planetID")
      .where("d.planetID = ?", id)
      .toString();

    const [[rows]] = await Database.query(query);

    return rows;
  }

  public async save(t: Defenses): Promise<void> {
    const query: string = squel
      .update()
      .table("defenses", "d")
      .set("rocketLauncher", t.rocketLauncher)
      .set("lightLaser", t.lightLaser)
      .set("heavyLaser", t.heavyLaser)
      .set("ionCannon", t.ionCannon)
      .set("gaussCannon", t.gaussCannon)
      .set("plasmaTurret", t.plasmaTurret)
      .set("smallShieldDome", t.smallShieldDome)
      .set("largeShieldDome", t.largeShieldDome)
      .set("antiBallisticMissile", t.antiBallisticMissile)
      .set("interplanetaryMissile", t.interplanetaryMissile)
      .where("planetID = ?", t.planetID)
      .toString();

    await Database.query(query);
  }

  public async create(t: Defenses): Promise<Defenses> {
    const query = squel
      .insert()
      .into("defenses")
      .set("planetID", t.planetID)
      .toString();

    await Database.query(query);

    return t;
  }

  public async createTransactional(planetID: number, connection): Promise<void> {
    const query = squel
      .insert()
      .into("defenses")
      .set("planetID", planetID)
      .toString();

    return await connection.query(query);
  }
}
