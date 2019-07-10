import * as chai from "chai";
import { InputValidator } from "./InputValidator";

const assert = chai.assert;
const expect = chai.expect;

describe("InputValidator", function() {
  it("Valid Int", function() {
    assert.equal(InputValidator.isValidInt("12"), true);
  });

  it("Valid Int", function() {
    let num = 12;
    assert.equal(InputValidator.isValidInt(`${12}`), true);
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
    const test = undefined;
    assert.equal(InputValidator.sanitizeString("häl/+=\"'lü"), "hll");
  });
});
