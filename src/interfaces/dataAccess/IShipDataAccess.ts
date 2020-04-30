export default interface IShipDataAccess {
  createShipsRow(planetID: number, connection);
  getShips(userID: number, planetID: number);
}
