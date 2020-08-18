import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import SerializationHelper from "../common/SerializationHelper";
import IEventService from "../interfaces/services/IEventService";
import Event from "../units/Event";
import squel = require("safe-squel");
import { injectable } from "inversify";


@injectable()
export default class EventService implements IEventService {

  public async create(event: Event) {
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

  public async getEvent(userID: number, eventID: number): Promise<Event> {
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

  public async cancel(event: Event) {
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
}
