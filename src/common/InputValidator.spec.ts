import * as chai from "chai";
import { Globals } from "./Globals";
import InputValidator from "./InputValidator";

const assert = chai.assert;

describe("InputValidator", function() {
  it("Valid Int", function() {
    assert.equal(InputValidator.isValidInt("12"), true);
  });

  it("Valid Int", function() {
    assert.equal(InputValidator.isValidInt(`${12}`), true);
  });

  it("Valid Int", function() {
    // eslint-disable-next-line quotes
    const data = JSON.parse('{ "test": 1 }');
    assert.equal(InputValidator.isValidInt(data.test), true);
  });

  it("Invalid Int", function() {
    assert.equal(InputValidator.isValidInt("12a"), false);
  });

  it("Invalid Int", function() {
    assert.equal(InputValidator.isValidInt(""), false);
  });

  it("Valid Float", function() {
    assert.equal(InputValidator.isValidFloat("1.23"), true);
  });

  it("Valid Float", function() {
    assert.equal(InputValidator.isValidFloat(`${1.23}`), true);
  });

  it("Valid Float", function() {
    // eslint-disable-next-line quotes
    const data = JSON.parse('{ "test": 1.2 }');
    assert.equal(InputValidator.isValidFloat(data.test), true);
  });

  it("Invalid Float", function() {
    assert.equal(InputValidator.isValidFloat("12klafjsd.11a"), false);
  });

  it("Invalid Float", function() {
    assert.equal(InputValidator.isValidFloat(""), false);
  });

  it("Valid JSON", function() {
    // eslint-disable-next-line prettier/prettier
    assert.equal(InputValidator.isValidJson("{ \"test\" : 12}"), true);
  });

  it("Invalid JSON", function() {
    assert.equal(InputValidator.isValidJson("{ 'test': 12, {}}"), false);
  });

  it("Variable is set", function() {
    const test = 12;
    assert.equal(InputValidator.isSet(test), true);
  });

  it("Variable is not set", function() {
    const test = undefined;
    assert.equal(InputValidator.isSet(test), false);
  });

  it("Sanitize string", function() {
    assert.equal(InputValidator.sanitizeString("häl/+=\"'lü"), "hll");
  });

  it("Valid build-order (building)", function() {
    assert.equal(InputValidator.isValidBuildOrder({}, Globals.UnitType.BUILDING), null);
  });

  it("Valid build-order (technology)", function() {
    assert.equal(InputValidator.isValidBuildOrder({}, Globals.UnitType.TECHNOLOGY), null);
  });

  it("Valid build-order (ship)", function() {
    assert.equal(InputValidator.isValidBuildOrder({ 201: 1 }, Globals.UnitType.SHIP), true);
  });

  it("Valid build-order (ship)", function() {
    assert.equal(InputValidator.isValidBuildOrder({ 301: 1 }, Globals.UnitType.SHIP), false);
  });

  it("Valid build-order (defense)", function() {
    assert.equal(InputValidator.isValidBuildOrder({ 301: 1 }, Globals.UnitType.DEFENSE), true);
  });

  it("Valid build-order (defense)", function() {
    assert.equal(InputValidator.isValidBuildOrder({ 401: 1 }, Globals.UnitType.DEFENSE), false);
  });
});
