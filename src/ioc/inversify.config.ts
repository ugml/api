import { Controller } from "tsoa";
import { Container, inject, interfaces, decorate, injectable } from "inversify";
import { autoProvide, fluentProvide, buildProviderModule } from "inversify-binding-decorators";

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
import IBuildingService from "../interfaces/services/IBuildingService";
import IDefenseService from "../interfaces/services/IDefenseService";
import IEventService from "../interfaces/services/IEventService";
import IGalaxyService from "../interfaces/services/IGalaxyService";
import IMessageService from "../interfaces/services/IMessageService";
import IPlanetService from "../interfaces/services/IPlanetService";
import IShipService from "../interfaces/services/IShipService";
import ITechService from "../interfaces/services/ITechService";
import { AuthRouter } from "../routes/AuthRouter";
import ILogger from "../interfaces/ILogger";
import SimpleLogger from "../loggers/SimpleLogger";
import {UsersRouter} from "../routes/UsersRouter";

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
iocContainer.bind<AuthRouter>(TYPES.AuthRouter).to(AuthRouter);
iocContainer.bind<UsersRouter>(TYPES.UsersRouter).to(UsersRouter);

export { iocContainer, autoProvide, inject, decorate, injectable };
