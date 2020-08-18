import GalaxyPositionInfo from "../../units/GalaxyPositionInfo";
import ICoordinates from "../ICoordinates";
import GalaxyRow from "../../units/GalaxyRow";

export default interface IGalaxyRepository {
  getPositionInfo(posGalaxy: number, posSystem: number): Promise<GalaxyPositionInfo[]>;
  getFreePosition(
    maxGalaxy: number,
    maxSystem: number,
    minPlanetPos: number,
    maxPlanetPos: number,
  ): Promise<ICoordinates>;
  createTransactional(row: GalaxyRow, connection): Promise<void>;
}
