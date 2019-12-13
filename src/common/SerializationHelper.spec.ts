import * as chai from "chai";
import User from "../units/User";
import Redis from "./Redis";
import SerializationHelper from "./SerializationHelper";

const expect = chai.expect;

describe("SerializationHelper", function() {
  it("Should create a new object of type user", function() {
    const data = {
      userID: 1,
      username: "testname",
      password: "password",
      email: "hello@world.com",
      last_time_online: 42,
      current_planet: 1,
      b_tech_id: 0,
      b_tech_endtime: 0,
    };
    const result: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    expect(result.userID).to.be.equals(data.userID);
    expect(result.username).to.be.equals(data.username);
    expect(result.password).to.be.equals(data.password);
    expect(result.email).to.be.equals(data.email);
    expect(result.last_time_online).to.be.equals(data.last_time_online);
    expect(result.current_planet).to.be.equals(data.current_planet);
    expect(result.isValid()).to.be.equals(true);
  });
});
