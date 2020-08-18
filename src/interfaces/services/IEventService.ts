import Event from "../../units/Event";

export default interface IEventService {
  create(event: Event);
  getEvent(userID: number, eventID: number): Promise<Event>;
  cancel(event: Event);
}
