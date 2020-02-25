import { Globals } from "../common/Globals";
import PlanetType = Globals.PlanetType;

export default interface ICoordinates {
  posGalaxy: number;
  posSystem: number;
  posPlanet: number;
  type: PlanetType;
}
