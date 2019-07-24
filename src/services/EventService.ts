import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import SerializationHelper from "../common/SerializationHelper";
import IEventService from "../interfaces/IEventService";
import Event from "../units/Event";
import squel = require("safe-squel");

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

    const result = await Database.query(query);

    return result;
  }

  /**
   * Returns an event of a user
   * @param userID the ID of the user
   * @param eventID the ID of the event
   */
  public async getEventOfPlayer(userID: number, eventID: number): Promise<Event> {
    const query: string = squel
      .select()
      .from("events")
      .where("eventID = ?", eventID)
      .where("ownerID = ?", userID)
      .toString();

    const [[result]] = await Database.query(query);

    if (!InputValidator.isSet(result)) {
      return null;
    }

    return SerializationHelper.toInstance(new Event(), JSON.stringify(result));
  }

  /**
   * Cancels an event
   * @param event the event to be canceled
   */
  public async cancelEvent(event: Event) {
    const query: string = squel
      .update()
      .table("events")
      .set("start_id", event.end_id)
      .set("start_type", event.end_type)
      .set("start_time", event.start_time)
      .set("end_id", event.start_id)
      .set("end_type", event.start_type)
      .set("end_time", event.end_time)
      .set("`returning`", 1)
      .where("eventID = ?", event.eventID)
      .where("`returning` = ?", 0)
      .where("ownerID = ?", event.ownerID)
      .toString();

    return await Database.query(query);
  }
}
