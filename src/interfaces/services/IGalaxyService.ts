import GalaxyPositionInfo from "../../units/GalaxyPositionInfo";
import ICoordinates from "../ICoordinates";

export default interface IGalaxyService {
  getPositionInfo(posGalaxy: number, posSystem: number): Promise<GalaxyPositionInfo[]>;
  getFreePosition(): Promise<ICoordinates>;
}
