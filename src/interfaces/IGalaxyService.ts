import ICoordinates from "./ICoordinates";

export default interface IGalaxyService {
  getFreePosition(maxGalaxy: number, maxSystem: number, minPlanet: number, maxPlanet: number): Promise<ICoordinates>;
  createGalaxyRow(planetID: number, pos_galaxy: number, pos_system: number, pos_planet: number, connection);
  getGalaxyInfo(pos_galaxy: number, pos_system: number);
}
