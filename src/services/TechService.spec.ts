import * as chai from "chai";
import TechService from "./TechService";

const expect = chai.expect;

const createContainer = require("../ioc/createContainer");

const container = createContainer();

describe("TechService", () => {
  it("should return a planet", async () => {
    try {
      await container.techService.createTechRow(1);
    } catch (error) {
      expect(error.message).contains("Duplicate entry");
    }
  });
});
