import IBuildingRepository from "../interfaces/repositories/IBuildingRepository";
import Buildings from "../units/Buildings";
import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import SerializationHelper from "../common/SerializationHelper";
import * as squel from "safe-squel";
import { injectable } from "inversify";

@injectable()
export default class BuildingRepository implements IBuildingRepository {
  public async create(t: Buildings): Promise<Buildings> {
    const query = squel
      .insert()
      .into("buildings")
      .set("planetID", t.planetID)
      .toString();

    await Database.query(query);

    return t;
  }

  public async createTransactional(planetID: number, connection): Promise<void> {
    const query = squel
      .insert()
      .into("buildings")
      .set("planetID", planetID)
      .toString();

    await connection.query(query);
  }

  public async exists(id: number): Promise<boolean> {
    const query: string = squel
      .select()
      .from("buildings", "b")
      .where("b.planetID = ?", id)
      .toString();

    const [rows] = await Database.query(query);

    return InputValidator.isSet(rows);
  }

  public async getById(id: number): Promise<Buildings> {
    const query: string = squel
      .select()
      .from("buildings", "b")
      .where("b.planetID = ?", id)
      .toString();

    const [rows] = await Database.query(query);

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return SerializationHelper.toInstance(new Buildings(), JSON.stringify(rows[0]));
  }

  public async save(t: Buildings): Promise<void> {
    const query: string = squel
      .update()
      .table("buildings", "b")
      .set("metalMine", t.metalMine)
      .set("crystalMine", t.crystalMine)
      .set("deuteriumSynthesizer", t.deuteriumSynthesizer)
      .set("solarPlant", t.solarPlant)
      .set("fusionReactor", t.fusionReactor)
      .set("roboticFactory", t.roboticFactory)
      .set("naniteFactory", t.naniteFactory)
      .set("shipyard", t.shipyard)
      .set("metalStorage", t.metalMine)
      .set("crystalStorage", t.crystalStorage)
      .set("deuteriumStorage", t.deuteriumStorage)
      .set("researchLab", t.researchLab)
      .set("terraformer", t.terraformer)
      .set("allianceDepot", t.allianceDepot)
      .where("planetID = ?", t.planetID)
      .toString();

    await Database.query(query);
  }
}
