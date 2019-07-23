import * as chai from "chai";
import User from "../units/User";
import Redis from "./Redis";
import SerializationHelper from "./SerializationHelper";

const expect = chai.expect;

describe("Redis", function() {
  it("Should create a new object of type user", function() {
    const data = {
      userID: 1,
      username: "testname",
      password: "password",
      email: "hello@world.com",
      onlinetime: 42,
      currentplanet: 1,
    };
    const result: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    expect(result.userID).to.be.equals(data.userID);
    expect(result.username).to.be.equals(data.username);
    expect(result.password).to.be.equals(data.password);
    expect(result.email).to.be.equals(data.email);
    expect(result.onlinetime).to.be.equals(data.onlinetime);
    expect(result.currentplanet).to.be.equals(data.currentplanet);
    expect(result.isValid()).to.be.equals(true);
  });
});
