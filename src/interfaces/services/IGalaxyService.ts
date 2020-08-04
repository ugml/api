import GalaxyPositionInfo from "../../units/GalaxyPositionInfo";
import ICoordinates from "../ICoordinates";

export default interface IGalaxyService {
  getGalaxyInfo(posGalaxy: number, posSystem: number): Promise<GalaxyPositionInfo[]>;
  getFreePosition(): Promise<ICoordinates>;
  // createGalaxyRow(planetID: number, posGalaxy: number, posSystem: number, posPlanet: number, connection);
  // getGalaxyInfo(posGalaxy: number, posSystem: number);
}
