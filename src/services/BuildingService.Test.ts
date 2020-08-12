/* eslint-disable @typescript-eslint/no-var-requires */

import { anyNumber, anything, instance, mock, when } from "ts-mockito";

import IPlanetService from "../interfaces/services/IPlanetService";
import PlanetService from "./PlanetService";
import IRequirementsService from "../interfaces/services/IRequirementsService";
import RequirementsService from "./RequirementsService";
import IUserRepository from "../interfaces/repositories/IUserRepository";
import ITechnologiesRepository from "../interfaces/repositories/ITechnologiesRepository";
import IPlanetRepository from "../interfaces/repositories/IPlanetRepository";
import IBuildingRepository from "../interfaces/repositories/IBuildingRepository";
import UserRepository from "../repositories/UserRepository";
import TechnologiesRepository from "../repositories/TechnologiesRepository";
import PlanetRepository from "../repositories/PlanetRepository";
import BuildingRepository from "../repositories/BuildingRepository";
import Planet from "../units/Planet";
import User from "../units/User";
import Techs from "../units/Techs";
import Buildings from "../units/Buildings";
import BuildingService from "./BuildingService";
import BuildBuildingRequest from "../entities/requests/BuildBuildingRequest";
import ApiException from "../exceptions/ApiException";
import { Globals } from "../common/Globals";
import UnauthorizedException from "../exceptions/UnauthorizedException";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
chai.use(chaiAsPromised);

describe("BuildingService", () => {
  it("should start building", async () => {
    const planetServiceMock: IPlanetService = mock(PlanetService);
    const requirementsServiceMock: IRequirementsService = mock(RequirementsService);
    const buildingRepositoryMock: IBuildingRepository = mock(BuildingRepository);
    const planetRepositoryMock: IPlanetRepository = mock(PlanetRepository);
    const technologiesRepositoryMock: ITechnologiesRepository = mock(TechnologiesRepository);
    const userRepositoryMock: IUserRepository = mock(UserRepository);

    when(buildingRepositoryMock.exists(anyNumber())).thenResolve(true);

    when(planetRepositoryMock.getById(anyNumber())).thenResolve({
      planetID: 1,
      ownerID: 1,
      metal: 100000,
      crystal: 100000,
      deuterium: 100000,
      energyMax: 100000,
      isUpgradingBuilding(): boolean {
        return false;
      },
    } as Planet);

    when(userRepositoryMock.getById(anyNumber())).thenResolve({
      userID: 1,
    } as User);

    when(technologiesRepositoryMock.getById(anyNumber())).thenResolve({
      userID: 1,
    } as Techs);

    when(buildingRepositoryMock.getById(anyNumber())).thenResolve({
      planetID: 1,
      metalMine: 0,
      roboticFactory: 5,
      naniteFactory: 5,
    } as Buildings);

    when(requirementsServiceMock.requirementsFulfilled(anything(), anything(), anything())).thenReturn(true);

    const service = new BuildingService(
      instance(planetServiceMock),
      instance(requirementsServiceMock),
      instance(buildingRepositoryMock),
      instance(planetRepositoryMock),
      instance(technologiesRepositoryMock),
      instance(userRepositoryMock),
    );

    const request = {
      planetID: 1,
      buildingID: 1,
    } as BuildBuildingRequest;

    const userID = 1;

    const result: Planet = await service.startBuilding(request, userID);

    expect(result.bBuildingId).equals(request.buildingID);
    expect(result.bBuildingEndTime).greaterThan(Math.floor(Date.now() / 1000));
  });

  it("should fail (not enough resources)", async () => {
    const planetServiceMock: IPlanetService = mock(PlanetService);
    const requirementsServiceMock: IRequirementsService = mock(RequirementsService);
    const buildingRepositoryMock: IBuildingRepository = mock(BuildingRepository);
    const planetRepositoryMock: IPlanetRepository = mock(PlanetRepository);
    const technologiesRepositoryMock: ITechnologiesRepository = mock(TechnologiesRepository);
    const userRepositoryMock: IUserRepository = mock(UserRepository);

    when(buildingRepositoryMock.exists(anyNumber())).thenResolve(true);

    when(planetRepositoryMock.getById(anyNumber())).thenResolve({
      planetID: 1,
      ownerID: 1,
      metal: 10,
      crystal: 10,
      deuterium: 10,
      energyMax: 10,
      isUpgradingBuilding(): boolean {
        return false;
      },
    } as Planet);

    when(userRepositoryMock.getById(anyNumber())).thenResolve({
      userID: 1,
    } as User);

    when(technologiesRepositoryMock.getById(anyNumber())).thenResolve({
      userID: 1,
    } as Techs);

    when(buildingRepositoryMock.getById(anyNumber())).thenResolve({
      planetID: 1,
      metalMine: 0,
      roboticFactory: 5,
      naniteFactory: 5,
    } as Buildings);

    when(requirementsServiceMock.requirementsFulfilled(anything(), anything(), anything())).thenReturn(true);

    const service = new BuildingService(
      instance(planetServiceMock),
      instance(requirementsServiceMock),
      instance(buildingRepositoryMock),
      instance(planetRepositoryMock),
      instance(technologiesRepositoryMock),
      instance(userRepositoryMock),
    );

    const request = {
      planetID: 1,
      buildingID: 1,
    } as BuildBuildingRequest;

    const userID = 1;

    await expect(service.startBuilding(request, userID)).to.be.rejectedWith(ApiException, "Not enough resources");
  });

  it("should fail (requirements not met)", async () => {
    const planetServiceMock: IPlanetService = mock(PlanetService);
    const requirementsServiceMock: IRequirementsService = mock(RequirementsService);
    const buildingRepositoryMock: IBuildingRepository = mock(BuildingRepository);
    const planetRepositoryMock: IPlanetRepository = mock(PlanetRepository);
    const technologiesRepositoryMock: ITechnologiesRepository = mock(TechnologiesRepository);
    const userRepositoryMock: IUserRepository = mock(UserRepository);

    when(buildingRepositoryMock.exists(anyNumber())).thenResolve(true);

    when(planetRepositoryMock.getById(anyNumber())).thenResolve({
      planetID: 1,
      ownerID: 1,
      metal: 10,
      crystal: 10,
      deuterium: 10,
      energyMax: 10,
      isUpgradingBuilding(): boolean {
        return false;
      },
    } as Planet);

    when(userRepositoryMock.getById(anyNumber())).thenResolve({
      userID: 1,
    } as User);

    when(technologiesRepositoryMock.getById(anyNumber())).thenResolve({
      userID: 1,
    } as Techs);

    when(buildingRepositoryMock.getById(anyNumber())).thenResolve({
      planetID: 1,
      metalMine: 0,
      roboticFactory: 5,
      naniteFactory: 5,
    } as Buildings);

    when(requirementsServiceMock.requirementsFulfilled(anything(), anything(), anything())).thenReturn(false);

    const service = new BuildingService(
      instance(planetServiceMock),
      instance(requirementsServiceMock),
      instance(buildingRepositoryMock),
      instance(planetRepositoryMock),
      instance(technologiesRepositoryMock),
      instance(userRepositoryMock),
    );

    const request = {
      planetID: 1,
      buildingID: 1,
    } as BuildBuildingRequest;

    const userID = 1;

    await expect(service.startBuilding(request, userID)).to.be.rejectedWith(ApiException, "Requirements are not met");
  });

  it("should fail (user is researching)", async () => {
    const planetServiceMock: IPlanetService = mock(PlanetService);
    const requirementsServiceMock: IRequirementsService = mock(RequirementsService);
    const buildingRepositoryMock: IBuildingRepository = mock(BuildingRepository);
    const planetRepositoryMock: IPlanetRepository = mock(PlanetRepository);
    const technologiesRepositoryMock: ITechnologiesRepository = mock(TechnologiesRepository);
    const userRepositoryMock: IUserRepository = mock(UserRepository);

    when(buildingRepositoryMock.exists(anyNumber())).thenResolve(true);

    when(planetRepositoryMock.getById(anyNumber())).thenResolve({
      planetID: 1,
      ownerID: 1,
      metal: 10,
      crystal: 10,
      deuterium: 10,
      energyMax: 10,
      isUpgradingBuilding(): boolean {
        return false;
      },
    } as Planet);

    when(userRepositoryMock.getById(anyNumber())).thenResolve({
      userID: 1,
      isResearching(): boolean {
        return true;
      },
    } as User);

    const service = new BuildingService(
      instance(planetServiceMock),
      instance(requirementsServiceMock),
      instance(buildingRepositoryMock),
      instance(planetRepositoryMock),
      instance(technologiesRepositoryMock),
      instance(userRepositoryMock),
    );

    const request = {
      planetID: 1,
      buildingID: Globals.Buildings.RESEARCH_LAB,
    } as BuildBuildingRequest;

    const userID = 1;

    await expect(service.startBuilding(request, userID)).to.be.rejectedWith(
      ApiException,
      "Can't build this building while it is in use",
    );
  });

  it("should fail (user is building units)", async () => {
    const planetServiceMock: IPlanetService = mock(PlanetService);
    const requirementsServiceMock: IRequirementsService = mock(RequirementsService);
    const buildingRepositoryMock: IBuildingRepository = mock(BuildingRepository);
    const planetRepositoryMock: IPlanetRepository = mock(PlanetRepository);
    const technologiesRepositoryMock: ITechnologiesRepository = mock(TechnologiesRepository);
    const userRepositoryMock: IUserRepository = mock(UserRepository);

    when(buildingRepositoryMock.exists(anyNumber())).thenResolve(true);

    when(planetRepositoryMock.getById(anyNumber())).thenResolve({
      planetID: 1,
      ownerID: 1,
      metal: 10,
      crystal: 10,
      deuterium: 10,
      energyMax: 10,
      isBuildingUnits(): boolean {
        return true;
      },
      isUpgradingBuilding(): boolean {
        return false;
      },
    } as Planet);

    when(userRepositoryMock.getById(anyNumber())).thenResolve({
      userID: 1,
    } as User);

    const service = new BuildingService(
      instance(planetServiceMock),
      instance(requirementsServiceMock),
      instance(buildingRepositoryMock),
      instance(planetRepositoryMock),
      instance(technologiesRepositoryMock),
      instance(userRepositoryMock),
    );

    const request = {
      planetID: 1,
      buildingID: Globals.Buildings.ROBOTIC_FACTORY,
    } as BuildBuildingRequest;

    const userID = 1;

    await expect(service.startBuilding(request, userID)).to.be.rejectedWith(
      ApiException,
      "Can't build this building while it is in use",
    );
  });

  it("should fail (user is building a building)", async () => {
    const planetServiceMock: IPlanetService = mock(PlanetService);
    const requirementsServiceMock: IRequirementsService = mock(RequirementsService);
    const buildingRepositoryMock: IBuildingRepository = mock(BuildingRepository);
    const planetRepositoryMock: IPlanetRepository = mock(PlanetRepository);
    const technologiesRepositoryMock: ITechnologiesRepository = mock(TechnologiesRepository);
    const userRepositoryMock: IUserRepository = mock(UserRepository);

    when(buildingRepositoryMock.exists(anyNumber())).thenResolve(true);

    when(planetRepositoryMock.getById(anyNumber())).thenResolve({
      planetID: 1,
      ownerID: 1,
      metal: 10,
      crystal: 10,
      deuterium: 10,
      energyMax: 10,
      isUpgradingBuilding(): boolean {
        return true;
      },
    } as Planet);

    const service = new BuildingService(
      instance(planetServiceMock),
      instance(requirementsServiceMock),
      instance(buildingRepositoryMock),
      instance(planetRepositoryMock),
      instance(technologiesRepositoryMock),
      instance(userRepositoryMock),
    );

    const request = {
      planetID: 1,
      buildingID: Globals.Buildings.ROBOTIC_FACTORY,
    } as BuildBuildingRequest;

    const userID = 1;

    await expect(service.startBuilding(request, userID)).to.be.rejectedWith(
      ApiException,
      "Planet already has a build-job",
    );
  });

  it("should fail (user does not own the planet)", async () => {
    const planetServiceMock: IPlanetService = mock(PlanetService);
    const requirementsServiceMock: IRequirementsService = mock(RequirementsService);
    const buildingRepositoryMock: IBuildingRepository = mock(BuildingRepository);
    const planetRepositoryMock: IPlanetRepository = mock(PlanetRepository);
    const technologiesRepositoryMock: ITechnologiesRepository = mock(TechnologiesRepository);
    const userRepositoryMock: IUserRepository = mock(UserRepository);

    when(buildingRepositoryMock.exists(anyNumber())).thenResolve(true);

    when(planetRepositoryMock.getById(anyNumber())).thenResolve({
      planetID: 1,
      ownerID: 2,
      metal: 10,
      crystal: 10,
      deuterium: 10,
      energyMax: 10,
      isUpgradingBuilding(): boolean {
        return true;
      },
    } as Planet);

    const service = new BuildingService(
      instance(planetServiceMock),
      instance(requirementsServiceMock),
      instance(buildingRepositoryMock),
      instance(planetRepositoryMock),
      instance(technologiesRepositoryMock),
      instance(userRepositoryMock),
    );

    const request = {
      planetID: 1,
      buildingID: Globals.Buildings.ROBOTIC_FACTORY,
    } as BuildBuildingRequest;

    const userID = 1;

    await expect(service.startBuilding(request, userID)).to.be.rejectedWith(
      UnauthorizedException,
      "User does not own the planet",
    );
  });

  it("should fail (planet does not exist)", async () => {
    const planetServiceMock: IPlanetService = mock(PlanetService);
    const requirementsServiceMock: IRequirementsService = mock(RequirementsService);
    const buildingRepositoryMock: IBuildingRepository = mock(BuildingRepository);
    const planetRepositoryMock: IPlanetRepository = mock(PlanetRepository);
    const technologiesRepositoryMock: ITechnologiesRepository = mock(TechnologiesRepository);
    const userRepositoryMock: IUserRepository = mock(UserRepository);

    when(buildingRepositoryMock.exists(anyNumber())).thenResolve(false);

    const service = new BuildingService(
      instance(planetServiceMock),
      instance(requirementsServiceMock),
      instance(buildingRepositoryMock),
      instance(planetRepositoryMock),
      instance(technologiesRepositoryMock),
      instance(userRepositoryMock),
    );

    const request = {
      planetID: 1,
      buildingID: Globals.Buildings.ROBOTIC_FACTORY,
    } as BuildBuildingRequest;

    const userID = 1;

    await expect(service.startBuilding(request, userID)).to.be.rejectedWith(ApiException, "Planet does not exist");
  });
});
