import ITechnologiesRepository from "../interfaces/repositories/ITechnologiesRepository";
import Techs from "../units/Techs";
import { injectable } from "inversify";
import * as squel from "safe-squel";
import Database from "../common/Database";
import InputValidator from "../common/InputValidator";

@injectable()
export default class TechnologiesRepository implements ITechnologiesRepository {
  public async exists(id: number): Promise<boolean> {
    const query: string = squel
      .select()
      .from("techs")
      .where("userID = ?", id)
      .toString();

    const [[rows]] = await Database.query(query);

    return InputValidator.isSet(rows);
  }

  public async getById(id: number): Promise<Techs> {
    const query: string = squel
      .select()
      .from("techs")
      .where("userID = ?", id)
      .toString();

    const [[rows]] = await Database.query(query);

    return rows;
  }

  public async save(t: Techs): Promise<void> {
    const query = squel
      .update()
      .table("techs")
      .set("espionageTech", t.espionageTech)
      .set("computerTech", t.computerTech)
      .set("weaponTech", t.weaponTech)
      .set("armourTech", t.armourTech)
      .set("shieldingTech", t.shieldingTech)
      .set("energyTech", t.energyTech)
      .set("hyperspaceTech", t.hyperspaceTech)
      .set("combustionDriveTech", t.combustionDriveTech)
      .set("impulseDriveTech", t.impulseDriveTech)
      .set("hyperspaceDriveTech", t.hyperspaceDriveTech)
      .set("laserTech", t.laserTech)
      .set("ionTech", t.ionTech)
      .set("plasmaTech", t.plasmaTech)
      .set("intergalacticResearchTech", t.intergalacticResearchTech)
      .set("gravitonTech", t.gravitonTech)
      .where("userID = ?", t.userID)
      .toString();

    await Database.query(query);
  }

  public async create(t: Techs): Promise<Techs> {
    const query = squel
      .insert()
      .into("techs")
      .set("userID", t.userID)
      .toString();

    await Database.query(query);

    return t;
  }

  public async createTransactional(userID: number, connection): Promise<void> {
    const query = squel
      .insert()
      .into("techs")
      .set("userID", userID)
      .toString();

    return await connection.query(query);
  }
}
