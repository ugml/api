import "reflect-metadata";
/* eslint-disable @typescript-eslint/naming-convention */

const TYPES = {
  ILogger: Symbol("ILogger"),

  IUserService: Symbol("IUserService"),
  IBuildingService: Symbol("IBuildingService"),
  IDefenseService: Symbol("IDefenseService"),
  IEventService: Symbol("IEventService"),
  IGalaxyService: Symbol("IGalaxyService"),
  IMessageService: Symbol("IMessageService"),
  IPlanetService: Symbol("IPlanetService"),
  IShipService: Symbol("IShipService"),
  ITechService: Symbol("ITechService"),
  IAuthService: Symbol("IAuthService"),
  IRequirementsService: Symbol("IRequirementsService"),

  IBuildingRepository: Symbol("IBuildingRepository"),
  IPlanetRepository: Symbol("IPlanetRepository"),
  IUserRepository: Symbol("IUserRepository"),
  ITechnologiesRepository: Symbol("ITechnologiesRepository"),
  IDefenseRepository: Symbol("IDefenseRepository"),
  IGalaxyRepository: Symbol("IGalaxyRepository"),
  IMessageRepository: Symbol("IMessageRepository"),
  IShipsRepository: Symbol("IShipsRepository"),

  AuthRouter: Symbol("AuthRouter"),
  BuildingsRouter: Symbol("BuildingsRouter"),
  ConfigRouter: Symbol("ConfigRouter"),
  DefenseRouter: Symbol("DefenseRouter"),
  EventRouter: Symbol("EventRouter"),
  GalaxyRouter: Symbol("GalaxyRouter"),
  MessagesRouter: Symbol("MessagesRouter"),
  PlanetsRouter: Symbol("PlanetsRouter"),
  ShipsRouter: Symbol("ShipsRouter"),
  TechsRouter: Symbol("TechsRouter"),
  UsersRouter: Symbol("UsersRouter"),
};

export default TYPES;
