import * as chai from "chai";
import Config from "./Config";

const expect = chai.expect;
const assert = chai.assert;

describe("Config", function() {
  it("Get config", function() {
    expect(Config.getGameConfig()).to.have.deep.property("metal_start", 500);
  });

  it("Get Buildings", function() {
    assert.equal(Config.getBuildings().hasOwnProperty("1"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("2"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("3"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("4"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("5"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("6"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("7"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("8"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("9"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("10"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("11"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("12"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("13"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("14"), true);
    assert.equal(Config.getBuildings().hasOwnProperty("15"), true);
  });

  it("Get Ships", function() {
    assert.equal(Config.getShips().hasOwnProperty("201"), true);
    assert.equal(Config.getShips().hasOwnProperty("202"), true);
    assert.equal(Config.getShips().hasOwnProperty("203"), true);
    assert.equal(Config.getShips().hasOwnProperty("204"), true);
    assert.equal(Config.getShips().hasOwnProperty("205"), true);
    assert.equal(Config.getShips().hasOwnProperty("206"), true);
    assert.equal(Config.getShips().hasOwnProperty("207"), true);
    assert.equal(Config.getShips().hasOwnProperty("208"), true);
    assert.equal(Config.getShips().hasOwnProperty("209"), true);
    assert.equal(Config.getShips().hasOwnProperty("210"), true);
    assert.equal(Config.getShips().hasOwnProperty("211"), true);
    assert.equal(Config.getShips().hasOwnProperty("212"), true);
  });

  it("Get Defenses", function() {
    assert.equal(Config.getDefenses().hasOwnProperty("301"), true);
    assert.equal(Config.getDefenses().hasOwnProperty("302"), true);
    assert.equal(Config.getDefenses().hasOwnProperty("303"), true);
    assert.equal(Config.getDefenses().hasOwnProperty("304"), true);
    assert.equal(Config.getDefenses().hasOwnProperty("305"), true);
    assert.equal(Config.getDefenses().hasOwnProperty("306"), true);
    assert.equal(Config.getDefenses().hasOwnProperty("307"), true);
    assert.equal(Config.getDefenses().hasOwnProperty("308"), true);
    assert.equal(Config.getDefenses().hasOwnProperty("309"), true);
    assert.equal(Config.getDefenses().hasOwnProperty("310"), true);
  });

  it("Get Technologies", function() {
    assert.equal(Config.getTechnologies().hasOwnProperty("101"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("102"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("103"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("104"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("105"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("106"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("107"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("108"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("109"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("110"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("111"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("112"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("113"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("114"), true);
    assert.equal(Config.getTechnologies().hasOwnProperty("115"), true);
  });
});
