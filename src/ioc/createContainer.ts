import BuildingService from "../services/BuildingService";
import DefenseService from "../services/DefenseService";
import EventService from "../services/EventService";
import Container from "./container";
import GalaxyService from "../services/GalaxyService";
import MessageService from "../services/MessageService";
import PlanetService from "../services/PlanetService";
import ShipService from "../services/ShipService";
import TechService from "../services/TechService";
import UserService from "../services/UserService";
import ResetTokenService from "../services/ResetTokenService";

module.exports = function() {
  const container = new Container();

  container.service("buildingService", () => new BuildingService());
  container.service("defenseService", () => new DefenseService());
  container.service("eventService", () => new EventService());
  container.service("galaxyService", () => new GalaxyService());
  container.service("messageService", () => new MessageService());
  container.service("planetService", () => new PlanetService());
  container.service("shipService", () => new ShipService());
  container.service("techService", () => new TechService());
  container.service("userService", () => new UserService());
  container.service("resetTokenService", () => new ResetTokenService());

  return container;
};
