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
}
