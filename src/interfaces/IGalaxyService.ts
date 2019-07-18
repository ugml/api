import { ICoordinates } from "./ICoordinates";

export interface IGalaxyService {
  getFreePosition(maxGalaxy: number, maxSystem: number, minPlanet: number, maxPlanet: number): Promise<ICoordinates>;
  createGalaxyRow(planetID: number, galaxy: number, system: number, planet: number, connection);
  getGalaxyInfo(galaxy: number, system: number);
}
