import * as chai from "chai";
import Redis from "./Redis";

const expect = chai.expect;

describe("Redis", function() {
  it("Get connection", function() {
    expect(Redis.getConnection()).not.to.be.equals(null);
  });
});
