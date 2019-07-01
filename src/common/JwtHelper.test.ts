import * as mocha from "mocha";
import * as chai from "chai";
import { IJwt } from "../interfaces/IJwt";
import { JwtHelper } from "./JwtHelper";

const assert = chai.assert;
const expect = chai.expect;

describe("JwtHelper", function() {
  it("Generate Token", function() {
    let token = JwtHelper.generateToken(1);
    assert.equal((token.match(/\./g) || []).length, 2);
  });

  it("Validate Token", function() {
    let token = JwtHelper.generateToken(1);

    assert.equal(JwtHelper.validateToken(token).userID, 1);
  });
});
