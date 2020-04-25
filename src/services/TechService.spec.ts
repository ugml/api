import * as chai from "chai";

const expect = chai.expect;

// eslint-disable-next-line @typescript-eslint/no-var-requires
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
