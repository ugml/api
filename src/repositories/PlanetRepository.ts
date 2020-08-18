import IPlanetRepository from "../interfaces/repositories/IPlanetRepository";
import Planet from "../units/Planet";
import { injectable } from "inversify";
import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import * as squel from "safe-squel";
import Event from "../units/Event";
import SerializationHelper from "../common/SerializationHelper";

@injectable()
export default class PlanetRepository implements IPlanetRepository {
  public async exists(id: number): Promise<boolean> {
    const query = squel
      .select()
      .from("planets")
      .where("planetID = ?", id)
      .toString();

    const [result] = await Database.query(query);

    return InputValidator.isSet(result);
  }

  public async getById(id: number): Promise<Planet> {
    const query = squel
      .select()
      .from("planets")
      .where("planetID = ?", id)
      .toString();

    const [rows] = await Database.query(query);

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return SerializationHelper.toInstance(new Planet(), JSON.stringify(rows[0]));
  }

  public async save(t: Planet): Promise<void> {
    const query = squel
      .update()
      .table("planets")
      .set("ownerID", t.ownerID)
      .set("name", t.name)
      .set("posGalaxy", t.posGalaxy)
      .set("posSystem", t.posSystem)
      .set("posPlanet", t.posPlanet)
      .set("lastUpdate", t.lastUpdate)
      .set("planetType", t.planetType)
      .set("image", t.image)
      .set("diameter", t.diameter)
      .set("fieldsCurrent", t.fieldsCurrent)
      .set("fieldsMax", t.fieldsMax)
      .set("tempMin", t.tempMin)
      .set("tempMax", t.tempMax)
      .set("metal", t.metal)
      .set("crystal", t.crystal)
      .set("deuterium", t.deuterium)
      .set("energyUsed", t.energyUsed)
      .set("energyMax", t.energyMax)
      .set("metalMinePercent", t.metalMinePercent)
      .set("crystalMinePercent", t.crystalMinePercent)
      .set("deuteriumSynthesizerPercent", t.deuteriumSynthesizerPercent)
      .set("solarPlantPercent", t.solarPlantPercent)
      .set("fusionReactorPercent", t.fusionReactorPercent)
      .set("solarSatellitePercent", t.solarSatellitePercent)
      .set("bBuildingId", t.bBuildingId)
      .set("bBuildingEndTime", t.bBuildingEndTime)
      .set("bBuildingDemolition", t.bBuildingDemolition)
      .set("bHangarQueue", t.bHangarQueue)
      .set("bHangarStartTime", t.bHangarStartTime)
      .set("bHangarPlus", t.bHangarPlus)
      .set("destroyed", t.destroyed)
      .where("planetID = ?", t.planetID)
      .toString();

    await Database.query(query);
  }

  public async create(t: Planet): Promise<Planet> {
    const query = squel
      .insert()
      .into("planets")
      .set("ownerID", t.ownerID)
      .set("name", t.name)
      .set("posGalaxy", t.posGalaxy)
      .set("posSystem", t.posSystem)
      .set("posPlanet", t.posPlanet)
      .set("lastUpdate", t.lastUpdate)
      .set("planetType", t.planetType)
      .set("image", t.image)
      .set("diameter", t.diameter)
      .set("fieldsCurrent", t.fieldsCurrent)
      .set("fieldsMax", t.fieldsMax)
      .set("tempMin", t.tempMin)
      .set("tempMax", t.tempMax)
      .set("metal", t.metal)
      .set("crystal", t.crystal)
      .set("deuterium", t.deuterium)
      .set("energyUsed", t.energyUsed)
      .set("energyMax", t.energyMax)
      .set("metalMinePercent", t.metalMinePercent)
      .set("crystalMinePercent", t.crystalMinePercent)
      .set("deuteriumSynthesizerPercent", t.deuteriumSynthesizerPercent)
      .set("solarPlantPercent", t.solarPlantPercent)
      .set("fusionReactorPercent", t.fusionReactorPercent)
      .set("solarSatellitePercent", t.solarSatellitePercent)
      .set("bBuildingId", t.bBuildingId)
      .set("bBuildingEndTime", t.bBuildingEndTime)
      .set("bBuildingDemolition", t.bBuildingDemolition)
      .set("bHangarQueue", t.bHangarQueue)
      .set("bHangarStartTime", t.bHangarStartTime)
      .set("bHangarPlus", t.bHangarPlus)
      .set("destroyed", t.destroyed);

    if (InputValidator.isSet(t.planetID)) {
      query.set("planetID", t.planetID);
    }

    await Database.query(query.toString());

    return t;
  }

  public async createTransactional(t: Planet, connection): Promise<void> {
    const query = squel
      .insert()
      .into("planets")
      .set("planetID", t.planetID)
      .set("ownerID", t.ownerID)
      .set("name", t.name)
      .set("posGalaxy", t.posGalaxy)
      .set("posSystem", t.posSystem)
      .set("posPlanet", t.posPlanet)
      .set("lastUpdate", t.lastUpdate)
      .set("planetType", t.planetType)
      .set("image", t.image)
      .set("diameter", t.diameter)
      .set("fieldsMax", t.fieldsMax)
      .set("tempMin", t.tempMin)
      .set("tempMax", t.tempMax)
      .set("metal", t.metal)
      .set("crystal", t.crystal)
      .set("deuterium", t.deuterium)
      .toString();

    return await connection.query(query);
  }

  public async getAllOfUser(userID): Promise<Planet[]> {
    const query = squel
      .select()
      .from("planets")
      .where("ownerID = ?", userID);

    const [rows] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return rows;
  }

  public async getMovement(userID: number, planetID: number): Promise<Event[]> {
    const query: string = squel
      .select()
      .from("events")
      .where("ownerID = ?", userID)
      .where(
        squel
          .expr()
          .or(`startID = ${planetID}`)
          .or(`endID = ${planetID}`),
      )
      .toString();

    const [rows] = await Database.query(query);

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return rows;
  }

  public async delete(planetID: number, userID: number): Promise<void> {
    const query: string = squel
      .delete()
      .from("planets")
      .where("planetID = ?", planetID)
      .where("ownerID = ?", userID)
      .toString();

    return await Database.query(query);
  }

  public async getNewId(): Promise<number> {
    const query = "CALL getNewPlanetId();";

    const [[[result]]] = await Database.query(query);

    return result.planetID;
  }
}
