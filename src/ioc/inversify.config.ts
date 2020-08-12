import { Controller } from "tsoa";
import { Container, inject, decorate, injectable } from "inversify";
import { autoProvide, buildProviderModule } from "inversify-binding-decorators";

import TYPES from "./types";
import UserService from "../services/UserService";
import IUserService from "../interfaces/services/IUserService";
import BuildingService from "../services/BuildingService";
import DefenseService from "../services/DefenseService";
import EventService from "../services/EventService";
import GalaxyService from "../services/GalaxyService";
import MessageService from "../services/MessageService";
import PlanetService from "../services/PlanetService";
import ShipService from "../services/ShipService";
import TechService from "../services/TechService";
import AuthService from "../services/AuthService";
import IBuildingService from "../interfaces/services/IBuildingService";
import IDefenseService from "../interfaces/services/IDefenseService";
import IEventService from "../interfaces/services/IEventService";
import IGalaxyService from "../interfaces/services/IGalaxyService";
import IMessageService from "../interfaces/services/IMessageService";
import IPlanetService from "../interfaces/services/IPlanetService";
import IShipService from "../interfaces/services/IShipService";
import ITechService from "../interfaces/services/ITechService";
import IAuthService from "../interfaces/services/IAuthService";
import { AuthRouter } from "../routes/AuthRouter";
import ILogger from "../interfaces/ILogger";
import SimpleLogger from "../loggers/SimpleLogger";
import { UserRouter } from "../routes/UserRouter";
import BuildingRepository from "../repositories/BuildingRepository";
import IBuildingRepository from "../interfaces/repositories/IBuildingRepository";
import PlanetRepository from "../repositories/PlanetRepository";
import IPlanetRepository from "../interfaces/repositories/IPlanetRepository";
import UserRepository from "../repositories/UserRepository";
import IUserRepository from "../interfaces/repositories/IUserRepository";
import TechnologiesRepository from "../repositories/TechnologiesRepository";
import ITechnologiesRepository from "../interfaces/repositories/ITechnologiesRepository";
import RequirementsService from "../services/RequirementsService";
import IRequirementsService from "../interfaces/services/IRequirementsService";
import DefenseRepository from "../repositories/DefenseRepository";
import IDefenseRepository from "../interfaces/repositories/IDefenseRepository";
import MessageRepository from "../repositories/MessageRepository";
import IMessageRepository from "../interfaces/repositories/IMessageRepository";
import IShipsRepository from "../interfaces/repositories/IShipsRepository";
import ShipsRepository from "../repositories/ShipsRepository";
import GalaxyRepository from "../repositories/GalaxyRepository";
import IGalaxyRepository from "../interfaces/repositories/IGalaxyRepository";
import {BuildingsRouter} from "../routes/BuildingsRouter";
import {ConfigRouter} from "../routes/ConfigRouter";
import {DefenseRouter} from "../routes/DefenseRouter";
import {GalaxyRouter} from "../routes/GalaxyRouter";
import {MessagesRouter} from "../routes/MessagesRouter";
import {PlanetsRouter} from "../routes/PlanetsRouter";
import {ShipsRouter} from "../routes/ShipsRouter";
import {TechsRouter} from "../routes/TechsRouter";

const iocContainer = new Container();

decorate(injectable(), Controller);

iocContainer.load(buildProviderModule());

// Services
iocContainer.bind<ILogger>(TYPES.ILogger).to(SimpleLogger);
iocContainer.bind<IUserService>(TYPES.IUserService).to(UserService);
iocContainer.bind<IBuildingService>(TYPES.IBuildingService).to(BuildingService);
iocContainer.bind<IDefenseService>(TYPES.IDefenseService).to(DefenseService);
iocContainer.bind<IEventService>(TYPES.IEventService).to(EventService);
iocContainer.bind<IGalaxyService>(TYPES.IGalaxyService).to(GalaxyService);
iocContainer.bind<IMessageService>(TYPES.IMessageService).to(MessageService);
iocContainer.bind<IPlanetService>(TYPES.IPlanetService).to(PlanetService);
iocContainer.bind<IShipService>(TYPES.IShipService).to(ShipService);
iocContainer.bind<ITechService>(TYPES.ITechService).to(TechService);
iocContainer.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
iocContainer.bind<IRequirementsService>(TYPES.IRequirementsService).to(RequirementsService);

// Repositories
iocContainer.bind<IBuildingRepository>(TYPES.IBuildingRepository).to(BuildingRepository);
iocContainer.bind<IPlanetRepository>(TYPES.IPlanetRepository).to(PlanetRepository);
iocContainer.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
iocContainer.bind<ITechnologiesRepository>(TYPES.ITechnologiesRepository).to(TechnologiesRepository);
iocContainer.bind<IDefenseRepository>(TYPES.IDefenseRepository).to(DefenseRepository);
iocContainer.bind<IMessageRepository>(TYPES.IMessageRepository).to(MessageRepository);
iocContainer.bind<IShipsRepository>(TYPES.IShipsRepository).to(ShipsRepository);
iocContainer.bind<IGalaxyRepository>(TYPES.IGalaxyRepository).to(GalaxyRepository);

// Routers
iocContainer.bind<AuthRouter>(TYPES.AuthRouter).to(AuthRouter);
iocContainer.bind<BuildingsRouter>(TYPES.BuildingsRouter).to(BuildingsRouter);
iocContainer.bind<ConfigRouter>(TYPES.ConfigRouter).to(ConfigRouter);
iocContainer.bind<DefenseRouter>(TYPES.DefenseRouter).to(DefenseRouter);
// iocContainer.bind<EventRouter>(TYPES.EventRouter).to(EventRouter);
iocContainer.bind<GalaxyRouter>(TYPES.GalaxyRouter).to(GalaxyRouter);
iocContainer.bind<MessagesRouter>(TYPES.MessagesRouter).to(MessagesRouter);
iocContainer.bind<PlanetsRouter>(TYPES.PlanetsRouter).to(PlanetsRouter);
iocContainer.bind<ShipsRouter>(TYPES.ShipsRouter).to(ShipsRouter);
iocContainer.bind<TechsRouter>(TYPES.TechsRouter).to(TechsRouter);
iocContainer.bind<UserRouter>(TYPES.UsersRouter).to(UserRouter);

export { iocContainer, autoProvide, inject, decorate, injectable };
