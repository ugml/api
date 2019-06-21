import * as mocha from "mocha";
import * as chai from "chai";
import { InputValidator } from "../../src/common/InputValidator";

let assert = chai.assert;
let expect = chai.expect;

describe("InputValidator", function() {
  it("Valid Int", function() {
    assert.equal(InputValidator.isValidInt("12"), true);
  });

  it("Invalid Int", function() {
    assert.equal(InputValidator.isValidInt("12a"), false);
  });

  it("Valid Float", function() {
    assert.equal(InputValidator.isValidFloat("1.23"), true);
  });

  it("Invalid Float", function() {
    assert.equal(InputValidator.isValidFloat("12klafjsd.11a"), false);
  });

  it("Valid JSON", function() {
    // eslint-disable-next-line prettier/prettier
    assert.equal(InputValidator.isValidJson("{ \"test\" : 12}"), true);
  });

  it("Invalid JSON", function() {
    assert.equal(InputValidator.isValidJson("{ 'test': 12, {}}"), false);
  });

  it("Variable is set", function() {
    let test = 12;
    assert.equal(InputValidator.isSet(test), true);
  });

  it("Variable is not  set", function() {
    let test;
    assert.equal(InputValidator.isSet(test), false);
  });
});
