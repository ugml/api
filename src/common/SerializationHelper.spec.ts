import * as chai from "chai";
import User from "../units/User";
import SerializationHelper from "./SerializationHelper";

const expect = chai.expect;

describe("SerializationHelper", function() {
  it("Should create a new object of type user", function() {
    const data = {
      userID: 1,
      username: "testname",
      password: "password",
      email: "hello@world.com",
      lastTimeOnline: 42,
      currentPlanet: 1,
      bTechID: 0,
      bTechEndTime: 0,
    };
    const result: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    expect(result.userID).to.be.equals(data.userID);
    expect(result.username).to.be.equals(data.username);
    expect(result.password).to.be.equals(data.password);
    expect(result.email).to.be.equals(data.email);
    expect(result.lastTimeOnline).to.be.equals(data.lastTimeOnline);
    expect(result.currentPlanet).to.be.equals(data.currentPlanet);
    expect(result.isValid()).to.be.equals(true);
  });
});
