import { Globals } from "../common/Globals";
import PlanetType = Globals.PlanetType;

export default interface ICoordinates {
  galaxy: number;
  system: number;
  planet: number;
  type: PlanetType;
}
