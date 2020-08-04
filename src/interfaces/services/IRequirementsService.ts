import { IRequirement } from "../IGameConfig";
import Buildings from "../../units/Buildings";
import Techs from "../../units/Techs";

export default interface IRequirementsService {
  requirementsFulfilled(requirements: IRequirement[], buildings: Buildings, technologies: Techs): boolean;
}
