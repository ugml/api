import IPlanetService from "../interfaces/services/IPlanetService";
import Planet from "../units/Planet";

import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import IPlanetRepository from "../interfaces/repositories/IPlanetRepository";
import Event from "../units/Event";

import ApiException from "../exceptions/ApiException";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import RenamePlanetRequest from "../entities/requests/RenamePlanetRequest";

/**
 * This class defines a service to interact with the planets-table in the database
 */
@injectable()
export default class PlanetService implements IPlanetService {
  @inject(TYPES.IPlanetRepository) private planetRepository: IPlanetRepository;

  public async checkUserOwnsPlanet(userID: number, planetID: number): Promise<boolean> {
    const planet = await this.planetRepository.getById(planetID);

    return planet.ownerID === userID;
  }

  public async getAllPlanetsOfUser(userID: number): Promise<Planet[]> {
    return await this.planetRepository.getAllOfUser(userID);
  }

  public async getAllPlanetsOfOtherUser(userID: number): Promise<Planet[]> {
    return this.planetRepository.getAllOfOtherUser(userID);
  }

  public async getMovementOnPlanet(planetID: number, userID: number): Promise<Event[]> {
    return await this.planetRepository.getMovement(userID, planetID);
  }

  public async destroyPlanet(planetID: number, userID: number): Promise<void> {
    const planet: Planet = await this.planetRepository.getById(planetID);

    if (planet.ownerID !== userID) {
      throw new UnauthorizedException("User does not own the planet");
    }

    const planetList = await this.planetRepository.getAllOfUser(userID);

    if (planetList.length === 1) {
      throw new ApiException("The last planet cannot be destroyed");
    }

    return await this.planetRepository.delete(planetID, userID);
    // TODO: if the deleted planet was the current planet -> set another one as current planet
  }

  public async renamePlanet(request: RenamePlanetRequest, userID: number): Promise<Planet> {
    const planet: Planet = await this.planetRepository.getById(request.planetID);

    if (planet.ownerID !== userID) {
      throw new UnauthorizedException("Player does not own the planet");
    }

    planet.name = request.newName;

    await this.planetRepository.save(planet);

    return planet;
  }

  public async getPlanet(planetID: number, userID: number): Promise<Planet> {
    const planet: Planet = await this.planetRepository.getById(planetID);

    if (planet.ownerID !== userID) {
      return {
        planetID: planet.planetID,
        ownerID: planet.ownerID,
        name: planet.name,
        posGalaxy: planet.posGalaxy,
        posSystem: planet.posSystem,
        posPlanet: planet.posPlanet,
        planetType: planet.planetType,
        image: planet.image,
      } as Planet;
    }

    return planet;
  }

  // /**
  //  * Returns all information about a given planet owned by the given user.
  //  * @param userID the ID of the user
  //  * @param planetID the ID of the planet
  //  * @param fullInfo true - all informations are returned, false - only basic information is returned
  //  */
  // public async getPlanet(userID: number, planetID: number, fullInfo = false): Promise<Planet> {
  //   let query = squel
  //     .select()
  //     .from("planets", "p")
  //     .where("p.planetID = ?", planetID)
  //     .where("p.ownerID = ?", userID);
  //
  //   if (!fullInfo) {
  //     query = query
  //       .field("planetID")
  //       .field("ownerID")
  //       .field("name")
  //       .field("posGalaxy")
  //       .field("posSystem")
  //       .field("posPlanet")
  //       .field("planetType")
  //       .field("image");
  //   }
  //
  //   const [rows] = await Database.query(query.toString());
  //
  //   if (!InputValidator.isSet(rows)) {
  //     return null;
  //   }
  //
  //   return SerializationHelper.toInstance(new Planet(), JSON.stringify(rows[0]));
  // }
  //
  // /**
  //  * Updates a planet given a planet-object
  //  * @param planet the planet with changed data
  //  */
  // public async updatePlanet(planet: Planet): Promise<Planet> {
  //   let query = squel.update().table("planets");
  //
  //   if (!planet.isValid()) {
  //     throw new EntityInvalidException("Invalid entity");
  //   }
  //
  //   if (typeof planet.name !== "undefined") {
  //     query = query.set("name", planet.name);
  //   }
  //
  //   if (typeof planet.lastUpdate !== "undefined") {
  //     query = query.set("lastUpdate", planet.lastUpdate);
  //   }
  //
  //   if (typeof planet.fieldsCurrent !== "undefined") {
  //     query = query.set("fieldsCurrent", planet.fieldsCurrent);
  //   }
  //
  //   if (typeof planet.fieldsMax !== "undefined") {
  //     query = query.set("fieldsMax", planet.fieldsMax);
  //   }
  //
  //   if (typeof planet.metal !== "undefined") {
  //     query = query.set("metal", planet.metal);
  //   }
  //
  //   if (typeof planet.crystal !== "undefined") {
  //     query = query.set("crystal", planet.crystal);
  //   }
  //
  //   if (typeof planet.deuterium !== "undefined") {
  //     query = query.set("deuterium", planet.deuterium);
  //   }
  //
  //   if (typeof planet.energyUsed !== "undefined") {
  //     query = query.set("energyUsed", planet.energyUsed);
  //   }
  //
  //   if (typeof planet.energyMax !== "undefined") {
  //     query = query.set("energyMax", planet.energyMax);
  //   }
  //
  //   if (typeof planet.metalMinePercent !== "undefined") {
  //     query = query.set("metalMinePercent", planet.metalMinePercent);
  //   }
  //
  //   if (typeof planet.crystalMinePercent !== "undefined") {
  //     query = query.set("crystalMinePercent", planet.crystalMinePercent);
  //   }
  //
  //   if (typeof planet.deuteriumSynthesizerPercent !== "undefined") {
  //     query = query.set("deuteriumSynthesizerPercent", planet.deuteriumSynthesizerPercent);
  //   }
  //
  //   if (typeof planet.solarPlantPercent !== "undefined") {
  //     query = query.set("solarPlantPercent", planet.solarPlantPercent);
  //   }
  //
  //   if (typeof planet.fusionReactorPercent !== "undefined") {
  //     query = query.set("fusionReactorPercent", planet.fusionReactorPercent);
  //   }
  //
  //   if (typeof planet.solarSatellitePercent !== "undefined") {
  //     query = query.set("solarSatellitePercent", planet.solarSatellitePercent);
  //   }
  //
  //   if (typeof planet.bBuildingId !== "undefined") {
  //     query = query.set("bBuildingId", planet.bBuildingId);
  //   }
  //
  //   if (typeof planet.bBuildingEndTime !== "undefined") {
  //     query = query.set("bBuildingEndTime", planet.bBuildingEndTime);
  //   }
  //
  //   if (typeof planet.bBuildingDemolition !== "undefined") {
  //     query = query.set("bBuildingDemolition", planet.bBuildingDemolition);
  //   }
  //
  //   if (typeof planet.bHangarQueue !== "undefined") {
  //     query = query.set("bHangarQueue", planet.bHangarQueue);
  //   }
  //
  //   if (typeof planet.bHangarStartTime !== "undefined") {
  //     query = query.set("bHangarStartTime", planet.bHangarStartTime);
  //   }
  //
  //   if (typeof planet.bHangarPlus !== "undefined") {
  //     query = query.set("bHangarPlus", planet.bHangarPlus);
  //   }
  //
  //   if (typeof planet.destroyed !== "undefined") {
  //     query = query.set("destroyed", planet.destroyed);
  //   }
  //
  //   query = query.where("planetID = ?", planet.planetID);
  //
  //   await Database.query(query.toString());
  //
  //   return planet;
  // }
  //
  // /**
  //  * Returns a new, not yet taken planetID
  //  */
  // public async getNewId(): Promise<number> {
  //   const query = "CALL getNewPlanetId();";
  //
  //   const [[[result]]] = await Database.query(query);
  //
  //   return result.planetID;
  // }
  //
  // /**
  //  * Inserts a new planet into the database given a planet-object
  //  * @param planet the planet-object containing the information
  //  * @param connection a connection from the connection-pool, if this query should be executed within a transaction
  //  */
  // public async createNewPlanet(planet: Planet, connection = null) {
  //
  // }
  //
  // /**
  //  * Returns a list of all planets of a given user
  //  * @param userID the ID of the user
  //  * @param fullInfo true - all informations are returned, false - only basic information is returned
  //  */
  // public async getAllPlanetsOfUser(userID: number, fullInfo = false) {
  //   let query = squel
  //     .select()
  //     .from("planets")
  //     .where("ownerID = ?", userID);
  //
  //   if (!fullInfo) {
  //     query = query
  //       .field("planetID")
  //       .field("ownerID")
  //       .field("name")
  //       .field("posGalaxy")
  //       .field("posSystem")
  //       .field("posPlanet")
  //       .field("planetType")
  //       .field("image");
  //   }
  //
  //   const [rows] = await Database.query(query.toString());
  //
  //   if (!InputValidator.isSet(rows)) {
  //     return null;
  //   }
  //
  //   return rows;
  // }
  //
  // public async checkPlayerOwnsPlanet(userID: number, planetID: number): Promise<boolean> {
  //   const query = squel
  //     .select()
  //     .from("planets")
  //     .field("1")
  //     .where("ownerID = ?", userID)
  //     .where("planetID = ?", planetID);
  //
  //   const [rows] = await Database.query(query.toString());
  //
  //   console.log(rows);
  //
  //   return rows.length === 1;
  // }
  //
  // /**
  //  * Returns a list of flights to and from a given planet owned by a given user
  //  * @param userID the ID of the user
  //  * @param planetID the ID of the planet
  //  */
  // public async getMovementOnPlanet(userID: number, planetID: number) {
  //   const query: string = squel
  //     .select()
  //     .from("events")
  //     .where("ownerID = ?", userID)
  //     .where(
  //       squel
  //         .expr()
  //         .or(`startID = ${planetID}`)
  //         .or(`endID = ${planetID}`),
  //     )
  //     .toString();
  //
  //   const [rows] = await Database.query(query);
  //
  //   if (!InputValidator.isSet(rows)) {
  //     return null;
  //   }
  //
  //   return rows;
  // }
  //
  // /**
  //  * Deletes a planet
  //  * @param userID the ID of the user
  //  * @param planetID the ID of the planet
  //  */
  // public async deletePlanet(userID: number, planetID: number) {
  //   const query: string = squel
  //     .delete()
  //     .from("planets")
  //     .where("planetID = ?", planetID)
  //     .where("ownerID = ?", userID)
  //     .toString();
  //
  //   await Database.query(query);
  // }
  //
  // /**
  //  * Returns a planet or moon at a given position
  //  * @param userID
  //  * @param position
  //  */
  // public async getPlanetOrMoonAtPosition(position: ICoordinates): Promise<Planet> {
  //   const query = squel
  //     .select({ autoQuoteFieldNames: true })
  //     .from("planets")
  //     .where("posGalaxy = ?", position.posGalaxy)
  //     .where("posSystem = ?", position.posSystem)
  //     .where("posPlanet = ?", position.posPlanet)
  //     .where("planetType = ?", position.type)
  //     .toString();
  //
  //   const [[rows]] = await Database.query(query);
  //
  //   if (!InputValidator.isSet(rows)) {
  //     return null;
  //   }
  //
  //   return rows;
  // }
}
