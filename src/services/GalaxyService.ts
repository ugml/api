import Database from "../common/Database";
import { Globals } from "../common/Globals";
import ICoordinates from "../interfaces/ICoordinates";
import IGalaxyService from "../interfaces/IGalaxyService";
import PlanetType = Globals.PlanetType;

import squel = require("safe-squel");

/**
 * This class defines a service to interact with the galaxy-table in the database
 */
export default class GalaxyService implements IGalaxyService {
  /**
   * Returns all information for a given galaxy-position
   * @param pos_galaxy the galaxy
   * @param pos_system the system
   */
  public async getGalaxyInfo(pos_galaxy: number, pos_system: number) {
    const query: string = squel
      .select()
      .field("p.planetID")
      .field("p.ownerID")
      .field("u.username")
      .field("p.name")
      .field("p.pos_galaxy")
      .field("p.pos_system")
      .field("p.pos_planet")
      .field("p.last_update")
      .field("p.planet_type")
      .field("p.image")
      .field("g.debris_metal")
      .field("g.debris_crystal")
      .field("p.destroyed")
      .from("galaxy", "g")
      .left_join("planets", "p", "g.planetID = p.planetID")
      .left_join("users", "u", "u.userID = p.ownerID")
      .where("p.pos_galaxy = ?", pos_galaxy)
      .where("p.pos_system = ?", pos_system)
      .toString();

    console.log(query);

    const [rows] = await Database.query(query);

    return rows;
  }

  /**
   * Returns a not yet populated position in the universe within the given boundaries
   * @param maxGalaxy the maximum galaxy-position
   * @param maxSystem the maximum system-position
   * @param minPlanet the minimum planet-position
   * @param maxPlanet the maximum planet-position
   */
  public async getFreePosition(
    maxGalaxy: number,
    maxSystem: number,
    minPlanet: number,
    maxPlanet: number,
  ): Promise<ICoordinates> {
    // getFreePosition(MAX_GALAXY, MAX_SYSTEM, MIN_PLANET, MAX_PLANET)
    const queryUser = `CALL getFreePosition(${maxGalaxy}, ${maxSystem}, ${minPlanet}, ${maxPlanet});`;

    const [[[result]]] = await Database.query(queryUser);

    return {
      pos_galaxy: result.pos_galaxy,
      pos_system: result.pos_system,
      pos_planet: result.pos_planet,
      type: PlanetType.Planet,
    };
  }

  /**
   * Creates a new row in the database.
   * @param planetID the ID of the planet
   * @param pos_galaxy the galaxy-position
   * @param pos_system the system-position
   * @param pos_planet the planet-position
   * @param connection a connection from the connection-pool, if this query should be executed within a transaction
   */
  public async createGalaxyRow(
    planetID: number,
    pos_galaxy: number,
    pos_system: number,
    pos_planet: number,
    connection = null,
  ) {
    /* tslint:disable:max-line-length*/
    // eslint-disable-next-line max-len
    const query = `INSERT INTO galaxy(\`planetID\`, \`pos_galaxy\`, \`pos_system\`, \`pos_planet\`) VALUES (${planetID}, ${pos_galaxy}, ${pos_system}, ${pos_planet});`;
    /* tslint:enable:max-line-length*/

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }
}
