import ICosts from "../ICosts";

export default interface ICostsService {
  getCostsForNextLevel(unitID: number, currentLevel: number): Promise<ICosts>;
}
