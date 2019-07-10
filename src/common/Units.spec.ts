import * as mocha from "mocha";
import * as chai from "chai";
import { Config } from "./Config";
import { Units, UnitType } from "./Units";

const expect = chai.expect;
const assert = chai.assert;

const units: Units = new Units();

describe("Units", function() {
  it("Get Buildings", function() {
    assert.equal(units.getBuildings().hasOwnProperty("1"), true);
    assert.equal(units.getBuildings().hasOwnProperty("2"), true);
    assert.equal(units.getBuildings().hasOwnProperty("3"), true);
    assert.equal(units.getBuildings().hasOwnProperty("4"), true);
    assert.equal(units.getBuildings().hasOwnProperty("5"), true);
    assert.equal(units.getBuildings().hasOwnProperty("6"), true);
    assert.equal(units.getBuildings().hasOwnProperty("7"), true);
    assert.equal(units.getBuildings().hasOwnProperty("8"), true);
    assert.equal(units.getBuildings().hasOwnProperty("9"), true);
    assert.equal(units.getBuildings().hasOwnProperty("10"), true);
    assert.equal(units.getBuildings().hasOwnProperty("11"), true);
    assert.equal(units.getBuildings().hasOwnProperty("12"), true);
    assert.equal(units.getBuildings().hasOwnProperty("13"), true);
    assert.equal(units.getBuildings().hasOwnProperty("14"), true);
    assert.equal(units.getBuildings().hasOwnProperty("15"), true);
  });

  it("Get Ships", function() {
    assert.equal(units.getShips().hasOwnProperty("201"), true);
    assert.equal(units.getShips().hasOwnProperty("202"), true);
    assert.equal(units.getShips().hasOwnProperty("203"), true);
    assert.equal(units.getShips().hasOwnProperty("204"), true);
    assert.equal(units.getShips().hasOwnProperty("205"), true);
    assert.equal(units.getShips().hasOwnProperty("206"), true);
    assert.equal(units.getShips().hasOwnProperty("207"), true);
    assert.equal(units.getShips().hasOwnProperty("208"), true);
    assert.equal(units.getShips().hasOwnProperty("209"), true);
    assert.equal(units.getShips().hasOwnProperty("210"), true);
    assert.equal(units.getShips().hasOwnProperty("211"), true);
    assert.equal(units.getShips().hasOwnProperty("212"), true);
  });

  it("Get Defenses", function() {
    assert.equal(units.getDefenses().hasOwnProperty("301"), true);
    assert.equal(units.getDefenses().hasOwnProperty("302"), true);
    assert.equal(units.getDefenses().hasOwnProperty("303"), true);
    assert.equal(units.getDefenses().hasOwnProperty("304"), true);
    assert.equal(units.getDefenses().hasOwnProperty("305"), true);
    assert.equal(units.getDefenses().hasOwnProperty("306"), true);
    assert.equal(units.getDefenses().hasOwnProperty("307"), true);
    assert.equal(units.getDefenses().hasOwnProperty("308"), true);
    assert.equal(units.getDefenses().hasOwnProperty("309"), true);
    assert.equal(units.getDefenses().hasOwnProperty("310"), true);
  });

  it("Get Technologies", function() {
    assert.equal(units.getTechnologies().hasOwnProperty("101"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("102"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("103"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("104"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("105"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("106"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("107"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("108"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("109"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("110"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("111"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("112"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("113"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("114"), true);
    assert.equal(units.getTechnologies().hasOwnProperty("115"), true);
  });

  it("Should fail (ID is not a building)", function() {
    assert.equal(units.getCosts(1000, 0, UnitType.BUILDING), null);
  });

  it("Should fail (ID is not a ship)", function() {
    assert.equal(units.getCosts(1000, 0, UnitType.SHIP), null);
  });

  it("Should fail (ID is not a defense)", function() {
    assert.equal(units.getCosts(1000, 0, UnitType.DEFENSE), null);
  });

  it("Should fail (ID is not a technology)", function() {
    assert.equal(units.getCosts(1000, 0, UnitType.TECHNOLOGY), null);
  });

  it("Get costs of a building", function() {
    assert.equal(units.getCosts(1, 0, UnitType.BUILDING).metal, 60);
  });

  it("Get costs of a ship", function() {
    assert.equal(units.getCosts(201, 0, UnitType.SHIP).metal, 2000);
  });

  it("Get costs of a defense", function() {
    assert.equal(units.getCosts(301, 0, UnitType.DEFENSE).metal, 2000);
  });

  it("Get costs of a technology", function() {
    assert.equal(units.getCosts(101, 0, UnitType.TECHNOLOGY).metal, 200);
  });

  it("Valid build-order (building)", function() {
    assert.equal(units.isValidBuildOrder({}, UnitType.BUILDING), null);
  });

  it("Valid build-order (technology)", function() {
    assert.equal(units.isValidBuildOrder({}, UnitType.TECHNOLOGY), null);
  });

  it("Valid build-order (ship)", function() {
    assert.equal(units.isValidBuildOrder({ 201: 1 }, UnitType.SHIP), true);
  });

  it("Valid build-order (ship)", function() {
    assert.equal(units.isValidBuildOrder({ 301: 1 }, UnitType.SHIP), false);
  });

  it("Valid build-order (defense)", function() {
    assert.equal(units.isValidBuildOrder({ 301: 1 }, UnitType.DEFENSE), true);
  });

  it("Valid build-order (defense)", function() {
    assert.equal(units.isValidBuildOrder({ 401: 1 }, UnitType.DEFENSE), false);
  });
});
