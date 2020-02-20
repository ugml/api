import * as chai from "chai";
import Config from "./Config";

const expect = chai.expect;
const assert = chai.assert;

describe("Config", function() {
  it("Get config", function() {
    expect(Config.getGameConfig()).to.have.deep.property("metalStart", 500);
  });

  it("Get Buildings", function() {
    assert.equal(Config.getBuildings().length, 15);
  });

  it("Get Ships", function() {
    assert.equal(Config.getShips().length, 14);
  });

  it("Get Defenses", function() {
    assert.equal(Config.getDefenses().length, 10);
  });

  it("Get Technologies", function() {
    assert.equal(Config.getTechnologies().length, 15);
  });
});
