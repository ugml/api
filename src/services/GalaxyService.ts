import { Database } from "../common/Database";
import { ICoordinates } from "../interfaces/ICoordinates";
import { PlanetType } from "../units/Planet";

import squel = require("squel");

export class GalaxyService {
  public static async getFreePosition(
    maxGalaxy: number,
    maxSystem: number,
    minPlanet: number,
    maxPlanet: number,
  ): Promise<ICoordinates> {
    // getFreePosition(MAX_GALAXY, MAX_SYSTEM, MIN_PLANET, MAX_PLANET)
    const queryUser = `CALL getFreePosition(${maxGalaxy}, ${maxSystem}, ${minPlanet}, ${maxPlanet});`;

    const [[[result]]] = await Database.query(queryUser);

    return {
      galaxy: result.posGalaxy,
      system: result.posSystem,
      planet: result.posPlanet,
      type: PlanetType.Planet,
    };
  }

  public static async createGalaxyRow(
    planetID: number,
    galaxy: number,
    system: number,
    planet: number,
    connection = null,
  ) {
    /* tslint:disable:max-line-length*/
    // eslint-disable-next-line max-len
    const query = `INSERT INTO galaxy(\`planetID\`, \`pos_galaxy\`, \`pos_system\`, \`pos_planet\`) VALUES (${planetID}, ${galaxy}, ${system}, ${planet});`;
    /* tslint:enable:max-line-length*/

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }

  public static async getGalaxyInfo(galaxy: number, system: number) {
    const query: string = squel
      .select()
      .field("p.planetID")
      .field("p.ownerID")
      .field("u.username")
      .field("p.name")
      .field("p.galaxy")
      .field("p.`system`")
      .field("p.planet")
      .field("p.last_update")
      .field("p.planet_type")
      .field("p.image")
      .field("g.debris_metal")
      .field("g.debris_crystal")
      .field("p.destroyed")
      .from("galaxy", "g")
      .left_join("planets", "p", "g.planetID = p.planetID")
      .left_join("users", "u", "u.userID = p.ownerID")
      .where("pos_galaxy = ?", galaxy)
      .where("`pos_system` = ?", system)
      .toString();

    const [rows] = await Database.query(query);

    return rows;
  }
}
