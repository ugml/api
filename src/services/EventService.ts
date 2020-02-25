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
      .set("startID", event.startID)
      .set("startType", event.startType)
      .set("startTime", event.startTime)
      .set("endID", event.endID)
      .set("endType", event.endType)
      .set("endTime", event.endTime)
      .set("loadedMetal", event.loadedMetal)
      .set("loadedCrystal", event.loadedCrystal)
      .set("loadedDeuterium", event.loadedDeuterium)
      .toString();

    return await Database.query(query);
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
      .set("startID", event.endID)
      .set("startType", event.endType)
      .set("startTime", event.startTime)
      .set("endID", event.startID)
      .set("endType", event.startType)
      .set("endTime", event.endTime)
      .set("`returning`", 1)
      .where("eventID = ?", event.eventID)
      .where("`returning` = ?", 0)
      .where("ownerID = ?", event.ownerID)
      .toString();

    return await Database.query(query);
  }

  /**
   * Retuns a list of all not yet processed events
   */
  public async getAllUnprocessedEvents() {
    const query: string = squel
      .select()
      .from("events")
      .where("processed = ?", false)
      .toString();

    const [result] = await Database.query(query);
    return result;
  }
}
