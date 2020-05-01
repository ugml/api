import { IRequirement } from "../IGameConfig";

export default interface IRequirementService {
  getRequirementsForUnit(unitID: number): Promise<IRequirement[]>;
  meetsRequirements(unitID: number, planetID: number, userID: number): Promise<boolean>;
}
