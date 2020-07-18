export default interface IShipService {
  createShipsRow(planetID: number, connection);
  getShips(userID: number, planetID: number);
}
