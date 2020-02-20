import ICoordinates from "./ICoordinates";

export default interface IGalaxyService {
  getFreePosition(maxGalaxy: number, maxSystem: number, minPlanet: number, maxPlanet: number): Promise<ICoordinates>;
  createGalaxyRow(planetID: number, posGalaxy: number, posSystem: number, posPlanet: number, connection);
  getGalaxyInfo(posGalaxy: number, posSystem: number);
}
