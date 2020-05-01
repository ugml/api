import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import SerializationHelper from "../common/SerializationHelper";
import ICoordinates from "../interfaces/ICoordinates";
import IPlanetDataAccess from "../interfaces/dataAccess/IPlanetDataAccess";
import Planet from "../units/Planet";
import squel = require("safe-squel");
import EntityInvalidException from "../exceptions/EntityInvalidException";

/**
 * This class defines a DataAccess to interact with the planets-table in the database
 */
export default class PlanetDataAccess implements IPlanetDataAccess {
  public async getPlanetByIDWithBasicInformation(planetID: number): Promise<Planet> {
    const query = squel
      .select()
      .from("planets", "p")
      .field("planetID")
      .field("ownerID")
      .field("name")
      .field("posGalaxy")
      .field("posSystem")
      .field("posPlanet")
      .field("planetType")
      .field("image")
      .where("p.planetID = ?", planetID);

    const [rows] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return SerializationHelper.toInstance(new Planet(), JSON.stringify(rows[0]));
  }

  /**
   * Returns all information about a given planet owned by the given user.
   * @param userID the ID of the user
   * @param planetID the ID of the planet
   * @param fullInfo true - all informations are returned, false - only basic information is returned
   */
  public async getPlanetByIDWithFullInformation(planetID: number): Promise<Planet> {
    const query = squel
      .select()
      .from("planets", "p")
      .where("p.planetID = ?", planetID);

    const [rows] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return SerializationHelper.toInstance(new Planet(), JSON.stringify(rows[0]));
  }

  /**
   * Updates a planet given a planet-object
   * @param planet the planet with changed data
   */
  public async updatePlanet(planet: Planet): Promise<Planet> {
    let query = squel.update().table("planets");

    if (!planet.isValid()) {
      throw new EntityInvalidException("Invalid entity");
    }

    if (typeof planet.name !== "undefined") {
      query = query.set("name", planet.name);
    }

    if (typeof planet.lastUpdate !== "undefined") {
      query = query.set("lastUpdate", planet.lastUpdate);
    }

    if (typeof planet.fieldsCurrent !== "undefined") {
      query = query.set("fieldsCurrent", planet.fieldsCurrent);
    }

    if (typeof planet.fieldsMax !== "undefined") {
      query = query.set("fieldsMax", planet.fieldsMax);
    }

    if (typeof planet.metal !== "undefined") {
      query = query.set("metal", planet.metal);
    }

    if (typeof planet.crystal !== "undefined") {
      query = query.set("crystal", planet.crystal);
    }

    if (typeof planet.deuterium !== "undefined") {
      query = query.set("deuterium", planet.deuterium);
    }

    if (typeof planet.energyUsed !== "undefined") {
      query = query.set("energyUsed", planet.energyUsed);
    }

    if (typeof planet.energyMax !== "undefined") {
      query = query.set("energyMax", planet.energyMax);
    }

    if (typeof planet.metalMinePercent !== "undefined") {
      query = query.set("metalMinePercent", planet.metalMinePercent);
    }

    if (typeof planet.crystalMinePercent !== "undefined") {
      query = query.set("crystalMinePercent", planet.crystalMinePercent);
    }

    if (typeof planet.deuteriumSynthesizerPercent !== "undefined") {
      query = query.set("deuteriumSynthesizerPercent", planet.deuteriumSynthesizerPercent);
    }

    if (typeof planet.solarPlantPercent !== "undefined") {
      query = query.set("solarPlantPercent", planet.solarPlantPercent);
    }

    if (typeof planet.fusionReactorPercent !== "undefined") {
      query = query.set("fusionReactorPercent", planet.fusionReactorPercent);
    }

    if (typeof planet.solarSatellitePercent !== "undefined") {
      query = query.set("solarSatellitePercent", planet.solarSatellitePercent);
    }

    if (typeof planet.bBuildingId !== "undefined") {
      query = query.set("bBuildingId", planet.bBuildingId);
    }

    if (typeof planet.bBuildingEndTime !== "undefined") {
      query = query.set("bBuildingEndTime", planet.bBuildingEndTime);
    }

    if (typeof planet.bBuildingDemolition !== "undefined") {
      query = query.set("bBuildingDemolition", planet.bBuildingDemolition);
    }

    if (typeof planet.bHangarQueue !== "undefined") {
      query = query.set("bHangarQueue", planet.bHangarQueue);
    }

    if (typeof planet.bHangarStartTime !== "undefined") {
      query = query.set("bHangarStartTime", planet.bHangarStartTime);
    }

    if (typeof planet.bHangarPlus !== "undefined") {
      query = query.set("bHangarPlus", planet.bHangarPlus);
    }

    if (typeof planet.destroyed !== "undefined") {
      query = query.set("destroyed", planet.destroyed);
    }

    query = query.where("planetID = ?", planet.planetID);

    await Database.query(query.toString());

    return planet;
  }

  /**
   * Returns a new, not yet taken planetID
   */
  public async getNewId(): Promise<number> {
    const query = "CALL getNewPlanetId();";

    const [[[result]]] = await Database.query(query);

    return result.planetID;
  }

  /**
   * Inserts a new planet into the database given a planet-object
   * @param planet the planet-object containing the information
   * @param connection a connection from the connection-pool, if this query should be executed within a transaction
   */
  public async createNewPlanet(planet: Planet, connection = null) {
    const query = squel
      .insert()
      .into("planets")
      .set("planetID", planet.planetID)
      .set("ownerID", planet.ownerID)
      .set("name", planet.name)
      .set("posGalaxy", planet.posGalaxy)
      .set("posSystem", planet.posSystem)
      .set("posPlanet", planet.posPlanet)
      .set("lastUpdate", planet.lastUpdate)
      .set("planetType", planet.planetType)
      .set("image", planet.image)
      .set("diameter", planet.diameter)
      .set("fieldsMax", planet.fieldsMax)
      .set("tempMin", planet.tempMin)
      .set("tempMax", planet.tempMax)
      .set("metal", planet.metal)
      .set("crystal", planet.crystal)
      .set("deuterium", planet.deuterium)
      .toString();

    if (connection === null) {
      return await Database.query(query);
    } else {
      return await connection.query(query);
    }
  }

  /**
   * Returns a list of all planets of a given user
   * @param userID the ID of the user
   * @param fullInfo true - all informations are returned, false - only basic information is returned
   */
  public async getAllPlanetsOfUser(userID: number, fullInfo = false) {
    let query = squel
      .select()
      .from("planets")
      .where("ownerID = ?", userID);

    if (!fullInfo) {
      query = query
        .field("planetID")
        .field("ownerID")
        .field("name")
        .field("posGalaxy")
        .field("posSystem")
        .field("posPlanet")
        .field("planetType")
        .field("image");
    }

    const [rows] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return rows;
  }

  /**
   * Returns a list of flights to and from a given planet owned by a given user
   * @param userID the ID of the user
   * @param planetID the ID of the planet
   */
  public async getMovementOnPlanet(userID: number, planetID: number) {
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

  /**
   * Deletes a planet
   * @param userID the ID of the user
   * @param planetID the ID of the planet
   */
  public async deletePlanet(userID: number, planetID: number) {
    const query: string = squel
      .delete()
      .from("planets")
      .where("planetID = ?", planetID)
      .where("ownerID = ?", userID)
      .toString();

    await Database.query(query);
  }

  /**
   * Returns a planet or moon at a given position
   * @param userID
   * @param position
   */
  public async getPlanetOrMoonAtPosition(position: ICoordinates): Promise<Planet> {
    const query = squel
      .select({ autoQuoteFieldNames: true })
      .from("planets")
      .where("posGalaxy = ?", position.posGalaxy)
      .where("posSystem = ?", position.posSystem)
      .where("posPlanet = ?", position.posPlanet)
      .where("planetType = ?", position.type)
      .toString();

    const [[rows]] = await Database.query(query);

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return rows;
  }
}
