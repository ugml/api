import { Database } from "../common/Database";
import { ICoordinates } from "../interfaces/ICoordinates";
import { PlanetType } from "../units/Planet";

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
    // eslint-disable-next-line max-len
    const query = `INSERT INTO galaxy(\`planetID\`, \`pos_galaxy\`, \`pos_system\`, \`pos_planet\`) VALUES (${planetID}, ${galaxy}, ${system}, ${planet});`;

    if (connection === null) {
      return await Database.query(query);
    }

    return await connection.query(query);
  }
}
