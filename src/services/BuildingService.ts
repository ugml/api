import IBuildingsService from "../interfaces/services/IBuildingsService";
import Planet from "../units/Planet";
import InputValidator from "../common/InputValidator";
import Buildings from "../units/Buildings";
import UnitDoesNotExistException from "../exceptions/UnitDoesNotExistException";
import IBuildingDataAccess from "../interfaces/dataAccess/IBuildingDataAccess";
import IPlanetDataAccess from "../interfaces/dataAccess/IPlanetDataAccess";
import PermissionException from "../exceptions/PermissionException";

export default class BuildingsService implements IBuildingsService {
  private readonly buildingDataAccess: IBuildingDataAccess;
  private readonly planetDataAccess: IPlanetDataAccess;

  public async getBuildingsOnPlanetWithID(planetID: number, userID: number): Promise<Buildings> {
    const planet: Planet = await this.planetDataAccess.getPlanet(1, planetID, false);

    if (!InputValidator.isSet(planet)) {
      throw new UnitDoesNotExistException("Planet does not exist.");
    }

    if (planet.ownerID !== userID) {
      throw new PermissionException("User does not own the planet.");
    }

    return await this.buildingDataAccess.getBuildings(planetID);
  }
}
