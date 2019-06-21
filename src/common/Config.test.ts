import * as mocha from "mocha";
import * as chai from "chai";
import { Config } from "./Config";

let expect = chai.expect;

describe("Config", function() {
  it("Get config", function() {
    expect(Config.Get).to.have.deep.property("metal_start", 500);
  });
});
