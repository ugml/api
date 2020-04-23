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
   * @param posGalaxy the galaxy
   * @param posSystem the system
   */
  public async getGalaxyInfo(posGalaxy: number, posSystem: number) {
    const query: string = squel
      .select()
      .field("p.planetID")
      .field("p.ownerID")
      .field("u.username")
      .field("p.name")
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
    const queryUser = `CALL getFreePosition(${maxGalaxy}, ${maxSystem}, ${minPlanet}, ${maxPlanet});`;

    const [[[result]]] = await Database.query(queryUser);

    return {
      posGalaxy: result.posGalaxy,
      posSystem: result.posSystem,
      posPlanet: result.posPlanet,
      type: PlanetType.PLANET,
    };
  }

  /**
   * Creates a new row in the database.
   * @param planetID the ID of the planet
   * @param posGalaxy the galaxy-position
   * @param posSystem the system-position
   * @param posPlanet the planet-position
   * @param connection a connection from the connection-pool, if this query should be executed within a transaction
   */
  public async createGalaxyRow(
    planetID: number,
    posGalaxy: number,
    posSystem: number,
    posPlanet: number,
    connection = null,
  ) {
    /* tslint:disable:max-line-length*/
    // eslint-disable-next-line max-len
    const query = `INSERT INTO galaxy(\`planetID\`, \`posGalaxy\`, \`posSystem\`, \`posPlanet\`) VALUES (${planetID}, ${posGalaxy}, ${posSystem}, ${posPlanet});`;
    /* tslint:enable:max-line-length*/

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }
}
