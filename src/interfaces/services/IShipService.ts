import BuildShipsRequest from "../../entities/requests/BuildShipsRequest";
import Planet from "../../units/Planet";

export default interface IShipService {
  getShips(userID: number, planetID: number);
  processBuildOrder(request: BuildShipsRequest, userID: number): Promise<Planet>;
}
