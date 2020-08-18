import IGalaxyService from "../interfaces/services/IGalaxyService";

import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import IGalaxyRepository from "../interfaces/repositories/IGalaxyRepository";
import GalaxyPositionInfo from "../units/GalaxyPositionInfo";
import IGameConfig from "../interfaces/IGameConfig";
import Config from "../common/Config";
import ICoordinates from "../interfaces/ICoordinates";

/**
 * This class defines a service to interact with the galaxy-table in the database
 */
@injectable()
export default class GalaxyService implements IGalaxyService {
  @inject(TYPES.IGalaxyRepository) private galaxyRepository: IGalaxyRepository;

  /**
   * Returns all information for a given galaxy-position
   * @param posGalaxy the galaxy
   * @param posSystem the system
   */
  public async getPositionInfo(posGalaxy: number, posSystem: number): Promise<GalaxyPositionInfo[]> {
    return await this.galaxyRepository.getPositionInfo(posGalaxy, posSystem);
  }

  public async getFreePosition(): Promise<ICoordinates> {
    const gameConfig: IGameConfig = Config.getGameConfig();

    return await this.galaxyRepository.getFreePosition(
      gameConfig.server.limits.galaxy.max,
      gameConfig.server.limits.system.max,
      gameConfig.server.startPlanet.minPlanetPos,
      gameConfig.server.startPlanet.maxPlanetPos,
    );
  }
}
