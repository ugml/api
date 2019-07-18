import "reflect-metadata";

import { Container } from "inversify";
import { IBuildingService } from "./interfaces/IBuildingService";
import { IDefenseService } from "./interfaces/IDefenseService";
import { IGalaxyService } from "./interfaces/IGalaxyService";
import { IMessageService } from "./interfaces/IMessageService";
import { IPlanetService } from "./interfaces/IPlanetService";
import { IShipService } from "./interfaces/IShipService";
import { ITechService } from "./interfaces/ITechService";
import { IUserService } from "./interfaces/IUserService";
import { BuildingService } from "./services/BuildingService";
import { DefenseService } from "./services/DefenseService";
import { GalaxyService } from "./services/GalaxyService";
import { MessageService } from "./services/MessageService";
import { PlanetService } from "./services/PlanetService";
import { ShipService } from "./services/ShipService";
import { TechService } from "./services/TechService";
import { UserService } from "./services/UserService";
import { TYPES } from "./types";

const myContainer = new Container();

myContainer.bind<IUserService>(TYPES.IUserService).to(UserService);
myContainer.bind<IGalaxyService>(TYPES.IGalaxyService).to(GalaxyService);
myContainer.bind<IPlanetService>(TYPES.IPlanetService).to(PlanetService);
myContainer.bind<IBuildingService>(TYPES.IBuildingService).to(BuildingService);
myContainer.bind<IDefenseService>(TYPES.IDefenseService).to(DefenseService);
myContainer.bind<IShipService>(TYPES.IShipService).to(ShipService);
myContainer.bind<ITechService>(TYPES.ITechService).to(TechService);
myContainer.bind<IMessageService>(TYPES.IMessageService).to(MessageService);

export { myContainer };
