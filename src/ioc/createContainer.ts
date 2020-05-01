import Container from "./container";
import BuildingsDataAccess from "../dataAccess/BuildingsDataAccess";
import DefenseDataAccess from "../dataAccess/DefenseDataAccess";
import EventDataAccess from "../dataAccess/EventDataAccess";
import GalaxyDataAccess from "../dataAccess/GalaxyDataAccess";
import MessageDataAccess from "../dataAccess/MessageDataAccess";
import PlanetDataAccess from "../dataAccess/PlanetDataAccess";
import ShipDataAccess from "../dataAccess/ShipDataAccess";
import TechDataAccess from "../dataAccess/TechDataAccess";
import UserDataAccess from "../dataAccess/UserDataAccess";
import AuthenticationService from "../services/AuthenticationService";
import BuildingsService from "../services/BuildingsService";
import TimeService from "../services/TimeService";
import RequirementsService from "../services/RequirementsService";
import PlanetService from "../services/PlanetService";
import CostsService from "../services/CostsService";
import DefenseService from "../services/DefenseService";

module.exports = function() {
  const container = new Container();

  container.dataAccess("buildingsDataAccess", () => new BuildingsDataAccess());
  container.dataAccess("defenseDataAccess", () => new DefenseDataAccess());
  container.dataAccess("eventDataAccess", () => new EventDataAccess());
  container.dataAccess("galaxyDataAccess", () => new GalaxyDataAccess());
  container.dataAccess("messageDataAccess", () => new MessageDataAccess());
  container.dataAccess("planetDataAccess", () => new PlanetDataAccess());
  container.dataAccess("shipDataAccess", () => new ShipDataAccess());
  container.dataAccess("techDataAccess", () => new TechDataAccess());
  container.dataAccess("userDataAccess", () => new UserDataAccess());

  container.service("authenticationService", () => new AuthenticationService(container));
  container.service("costsService", () => new CostsService(container));
  container.service("requirementsService", () => new RequirementsService(container));
  container.service("timeService", () => new TimeService(container));
  container.service("planetService", () => new PlanetService(container));
  container.service("buildingsService", () => new BuildingsService(container));
  container.service("defenseService", () => new DefenseService(container));

  return container;
};
