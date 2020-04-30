import IPlanetService from "../interfaces/services/IPlanetService";
import IPlanetDataAccess from "../interfaces/dataAccess/IPlanetDataAccess";
import Planet from "../units/Planet";

export default class PlanetService implements IPlanetService {
  private planetDataAccess: IPlanetDataAccess;

  public async getPlanetByID(planetID: number): Promise<Planet> {
    return await this.planetDataAccess.getPlanetByID(planetID);
  }

  public async checkPlanetIsUpgradingBuilding(planetID: number): Promise<boolean> {
    const planet = await this.getPlanetByID(planetID);

    return planet.isUpgradingBuilding();
  }
}
