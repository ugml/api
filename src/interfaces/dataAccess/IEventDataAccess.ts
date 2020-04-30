import Event from "../../units/Event";

export default interface IEventDataAccess {
  createNewEvent(event: Event);
  getEventOfPlayer(userID: number, eventID: number): Promise<Event>;
  cancelEvent(event: Event);
}
