import { Globals } from "../common/Globals";

export default class GalaxyPositionInfo {
  planetID: number;
  ownerID: number;
  username: string;
  planetName: string;
  posGalaxy: number;
  posSystem: number;
  posPlanet: number;
  lastUpdate: number;
  planetType: Globals.PlanetType;
  image: string;
  debrisMetal: number;
  debrisCrystal: number;
  destroyed: boolean;
}
