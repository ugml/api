import Event from "../units/Event";
import ICoordinates from "./ICoordinates";

export default interface IEventService {
  createNewEvent(event: Event);
  getEventOfPlayer(userID: number, eventID: number): Promise<Event>;
  cancelEvent(event: Event);
}
