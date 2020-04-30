import BuildingDataAccess from "../dataAccess/BuildingDataAccess";
import DefenseDataAccess from "../dataAccess/DefenseDataAccess";
import EventDataAccess from "../dataAccess/EventDataAccess";
import Container from "./container";
import GalaxyDataAccess from "../dataAccess/GalaxyDataAccess";
import MessageDataAccess from "../dataAccess/MessageDataAccess";
import PlanetDataAccess from "../dataAccess/PlanetDataAccess";
import ShipDataAccess from "../dataAccess/ShipDataAccess";
import TechDataAccess from "../dataAccess/TechDataAccess";
import UserDataAccess from "../dataAccess/UserDataAccess";

module.exports = function() {
  const container = new Container();

  container.DataAccess("buildingDataAccess", () => new BuildingDataAccess());
  container.DataAccess("defenseDataAccess", () => new DefenseDataAccess());
  container.DataAccess("eventDataAccess", () => new EventDataAccess());
  container.DataAccess("galaxyDataAccess", () => new GalaxyDataAccess());
  container.DataAccess("messageDataAccess", () => new MessageDataAccess());
  container.DataAccess("planetDataAccess", () => new PlanetDataAccess());
  container.DataAccess("shipDataAccess", () => new ShipDataAccess());
  container.DataAccess("techDataAccess", () => new TechDataAccess());
  container.DataAccess("userDataAccess", () => new UserDataAccess());

  return container;
};
