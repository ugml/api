import * as chai from "chai";
import { iocContainer } from "../ioc/inversify.config";

import TYPES from "../ioc/types";
import ITechnologiesRepository from "../interfaces/repositories/ITechnologiesRepository";
import Techs from "../units/Techs";

const technologiesRepository = iocContainer.get<ITechnologiesRepository>(TYPES.ITechnologiesRepository);

const expect = chai.expect;

describe("TechService", () => {
  it("should fail (duplicate entry)", async () => {
    try {
      await technologiesRepository.create({
        userID: 1,
      } as Techs);
    } catch (error) {
      expect(error.message).contains("Duplicate entry");
    }
  });
});
