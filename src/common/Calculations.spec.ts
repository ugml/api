import * as chai from "chai";
import Calculations from "./Calculations";
import { Globals } from "./Globals";

const expect = chai.expect;
const assert = chai.assert;

describe("Calculations", function() {
  it("Should fail (ID is not a building)", function() {
    assert.equal(Calculations.getCosts(1000, 0, Globals.UnitType.BUILDING), null);
  });

  it("Should fail (ID is not a ship)", function() {
    assert.equal(Calculations.getCosts(1000, 0, Globals.UnitType.SHIP), null);
  });

  it("Should fail (ID is not a defense)", function() {
    assert.equal(Calculations.getCosts(1000, 0, Globals.UnitType.DEFENSE), null);
  });

  it("Should fail (ID is not a technology)", function() {
    assert.equal(Calculations.getCosts(1000, 0, Globals.UnitType.TECHNOLOGY), null);
  });

  it("Get costs of a building", function() {
    assert.equal(Calculations.getCosts(1, 0, Globals.UnitType.BUILDING).metal, 60);
  });

  it("Get costs of a ship", function() {
    assert.equal(Calculations.getCosts(201, 0, Globals.UnitType.SHIP).metal, 2000);
  });

  it("Get costs of a defense", function() {
    assert.equal(Calculations.getCosts(301, 0, Globals.UnitType.DEFENSE).metal, 2000);
  });

  it("Get costs of a technology", function() {
    assert.equal(Calculations.getCosts(101, 0, Globals.UnitType.TECHNOLOGY).metal, 200);
  });

  it("Calculate buildtime 1", function() {
    assert.equal(Calculations.calculateBuildTimeInSeconds(60, 15, 0, 0), 108);
  });

  it("Calculate buildtime 2", function() {
    assert.equal(Calculations.calculateBuildTimeInSeconds(500, 0, 5, 1), 60);
  });

  it("Calculate buildtime 3", function() {
    assert.equal(Calculations.calculateBuildTimeInSeconds(500, 300, 10, 2), 26);
  });

  it("Calculate buildtime 4", function() {
    assert.equal(Calculations.calculateBuildTimeInSeconds(5000000, 2000000, 14, 5), 21000);
  });

  it("Calculate researchtime 1", function() {
    assert.equal(Calculations.calculateResearchTimeInSeconds(60, 15, 1), 135000);
  });

  it("Calculate researchtime 2", function() {
    assert.equal(Calculations.calculateResearchTimeInSeconds(500, 500, 3), 900000);
  });

  it("Calculate researchtime 3", function() {
    assert.equal(Calculations.calculateResearchTimeInSeconds(80000, 140000, 18), 41684211);
  });

  it("Calculate researchtime 4", function() {
    assert.equal(Calculations.calculateResearchTimeInSeconds(10000000, 20000000, 43), 2454545455);
  });
});
