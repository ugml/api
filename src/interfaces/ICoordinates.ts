import { Globals } from "../common/Globals";
import PlanetType = Globals.PlanetType;

export default interface ICoordinates {
  pos_galaxy: number;
  pos_system: number;
  pos_planet: number;
  type: PlanetType;
}
