import IGalaxyRepository from "../interfaces/repositories/IGalaxyRepository";
import Database from "../common/Database";
import * as squel from "safe-squel";
import GalaxyPositionInfo from "../units/GalaxyPositionInfo";
import { injectable } from "inversify";
import { Globals } from "../common/Globals";
import PlanetType = Globals.PlanetType;
import ICoordinates from "../interfaces/ICoordinates";
import GalaxyRow from "../units/GalaxyRow";

@injectable()
export default class GalaxyRepository implements IGalaxyRepository {
  public async getPositionInfo(posGalaxy: number, posSystem: number): Promise<GalaxyPositionInfo[]> {
    const query: string = squel
      .select()
      .field("p.planetID")
      .field("p.ownerID")
      .field("u.username")
      .field("p.name", "planetName")
      .field("p.posGalaxy")
      .field("p.posSystem")
      .field("p.posPlanet")
      .field("p.lastUpdate")
      .field("p.planetType")
      .field("p.image")
      .field("g.debrisMetal")
      .field("g.debrisCrystal")
      .field("p.destroyed")
      .from("galaxy", "g")
      .left_join("planets", "p", "g.planetID = p.planetID")
      .left_join("users", "u", "u.userID = p.ownerID")
      .where("p.posGalaxy = ?", posGalaxy)
      .where("p.posSystem = ?", posSystem)
      .toString();

    const [rows] = await Database.query(query);

    return rows;
  }

  public async getFreePosition(
    maxGalaxy: number,
    maxSystem: number,
    minPlanetPos: number,
    maxPlanetPos: number,
  ): Promise<ICoordinates> {
    const queryUser = `CALL getFreePosition(${maxGalaxy}, ${maxSystem}, ${minPlanetPos}, ${maxPlanetPos});`;

    const [[[result]]] = await Database.query(queryUser);

    return {
      posGalaxy: result.posGalaxy,
      posSystem: result.posSystem,
      posPlanet: result.posPlanet,
      type: PlanetType.PLANET,
    };
  }

  public async createTransactional(row: GalaxyRow, connection): Promise<void> {
    const query = squel
      .insert()
      .into("galaxy")
      .set("planetID", row.planetID)
      .set("posGalaxy", row.posGalaxy)
      .set("posSystem", row.posSystem)
      .set("posPlanet", row.posPlanet)
      .toString();

    return await connection.query(query);
  }
}
