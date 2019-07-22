import * as chai from "chai";
import Calculations from "./Calculations";

const expect = chai.expect;
const assert = chai.assert;

describe("Calculations", function() {
  it("Should fail (ID is not a building)", function() {
    assert.equal(Calculations.getCosts(1000, 0), null);
  });

  it("Should fail (ID is not a ship)", function() {
    assert.equal(Calculations.getCosts(1000, 0), null);
  });

  it("Should fail (ID is not a defense)", function() {
    assert.equal(Calculations.getCosts(1000, 0), null);
  });

  it("Should fail (ID is not a technology)", function() {
    assert.equal(Calculations.getCosts(1000, 0), null);
  });

  it("Get costs of a building", function() {
    assert.equal(Calculations.getCosts(1, 0).metal, 60);
  });

  it("Get costs of a ship", function() {
    assert.equal(Calculations.getCosts(201, 0).metal, 2000);
  });

  it("Get costs of a defense", function() {
    assert.equal(Calculations.getCosts(301, 0).metal, 2000);
  });

  it("Get costs of a technology", function() {
    assert.equal(Calculations.getCosts(101, 0).metal, 200);
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

  it("Calculate free missile slots 1", function() {
    assert.equal(Calculations.calculateFreeMissileSlots(1, 0, 3), 4);
  });

  it("Calculate free missile slots 2", function() {
    assert.equal(Calculations.calculateFreeMissileSlots(5, 4, 2), 42);
  });

  it("Calculate free missile slots 3", function() {
    assert.equal(Calculations.calculateFreeMissileSlots(23, 8, 10), 202);
  });

  it("Calculate costs of building 1", function() {
    expect(Calculations.getCosts(1, 40)).to.be.eql({
      metal: 663439939,
      crystal: 165859985,
      deuterium: 0,
      energy: 0,
    });
  });

  it("Calculate costs of building 2", function() {
    expect(Calculations.getCosts(4, 13)).to.be.eql({
      metal: 14596,
      crystal: 5839,
      deuterium: 0,
      energy: 0,
    });
  });

  it("Calculate costs of building 3", function() {
    expect(Calculations.getCosts(14, 2)).to.be.eql({
      metal: 80000,
      crystal: 160000,
      deuterium: 0,
      energy: 0,
    });
  });

  it("Calculate costs of building 4", function() {
    expect(Calculations.getCosts(15, 3)).to.be.eql({
      metal: 160000,
      crystal: 160000,
      deuterium: 8000,
      energy: 0,
    });
  });

  it("Calculate costs of building 5 (should be null, unitID does not exist)", function() {
    expect(Calculations.getCosts(23, 8)).to.be.eql(null);
  });
});
