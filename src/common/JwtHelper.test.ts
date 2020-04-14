import * as chai from "chai";
import JwtHelper from "./JwtHelper";

const assert = chai.assert;

describe("JwtHelper", function() {
  it("Generate Token", function() {
    const token = JwtHelper.generateToken(1);
    assert.equal((token.match(/\./g) || []).length, 2);
  });

  it("Validate Token", function() {
    const token = JwtHelper.generateToken(1);

    assert.equal(JwtHelper.validateToken(token).userID, 1);
  });
});
