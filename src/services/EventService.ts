import Database from "../common/Database";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import SerializationHelper from "../common/SerializationHelper";
import ICoordinates from "../interfaces/ICoordinates";
import IEventService from "../interfaces/IEventService";
import Event from "../units/Event";
import Planet from "../units/Planet";
import squel = require("safe-squel");
import PlanetType = Globals.PlanetType;

/**
 * This class defines a service to interact manage events
 */
export default class EventService implements IEventService {
  /**
   *
   * @param event
   */
  public async createNewEvent(event: Event) {
    const query: string = squel
      .insert()
      .into("events")
      .set("ownerID", event.ownerID)
      .set("mission", event.mission)
      .set("fleetlist", event.fleetlist)
      .set("start_id", event.start_id)
      .set("start_type", event.start_type)
      .set("start_time", event.start_time)
      .set("end_id", event.end_id)
      .set("end_type", event.end_type)
      .set("end_time", event.end_time)
      .set("loaded_metal", event.loaded_metal)
      .set("loaded_crystal", event.loaded_crystal)
      .set("loaded_deuterium", event.loaded_deuterium)
      .toString();

    console.log(query);

    const result = await Database.query(query);

    console.log(result);

    return result;
  }
}
