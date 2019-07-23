import Event from "../units/Event";
import ICoordinates from "./ICoordinates";

export default interface IEventService {
  createNewEvent(event: Event);
}
