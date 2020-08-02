import * as chai from "chai";
import { iocContainer } from "../ioc/inversify.config";

import TYPES from "../ioc/types";
import ITechService from "../interfaces/services/ITechService";

const techService = iocContainer.get<ITechService>(TYPES.ITechService);

const expect = chai.expect;

describe("TechService", () => {
  it("should return a planet", async () => {
    try {
      await techService.createTechRow(1);
    } catch (error) {
      expect(error.message).contains("Duplicate entry");
    }
  });
});
