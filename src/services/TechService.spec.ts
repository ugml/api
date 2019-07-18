import * as chai from "chai";
import { TechService } from "./TechService";

const expect = chai.expect;

describe("TechService", () => {
  it("should return a planet", async () => {
    try {
      await this.techService.createTechRow(1);
    } catch (error) {
      expect(error.message).contains("Duplicate entry");
    }
  });
});
