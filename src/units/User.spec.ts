import * as chai from "chai";
import SerializationHelper from "../common/SerializationHelper";
import User from "./User";
import { Globals } from "../common/Globals";

const assert = chai.assert;

describe("User-units", function() {
  it("user should be valid", function() {
    const data = {
      userID: 1,
      username: "Testuser",
      password: "iAmNotSecure",
      email: "hello@world.com",
      lastTimeOnline: 1234,
      currentPlanet: 45312,
      bTechID: 0,
      bTechEndTime: 0,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), true);
  });

  it("Should fail (userID negative)", function() {
    const data = {
      userID: -1,
      username: "Testuser",
      password: "iAmNotSecure",
      email: "hello@world.com",
      lastTimeOnline: 1234,
      currentPlanet: 45312,
      bTechID: 0,
      bTechEndTime: 0,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (username too short)", function() {
    const data = {
      userID: 1,
      username: "Hi",
      password: "iAmNotSecure",
      email: "hello@world.com",
      lastTimeOnline: 1234,
      currentPlanet: 45312,
      bTechID: 0,
      bTechEndTime: 0,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (username too long)", function() {
    const data = {
      userID: 1,
      username: "IamWaaaaaaaaaaaaaaaayTooLong",
      password: "iAmNotSecure",
      email: "hello@world.com",
      lastTimeOnline: 1234,
      currentPlanet: 45312,
      bTechID: 0,
      bTechEndTime: 0,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (password too long)", function() {
    const data = {
      userID: 1,
      username: "Testname",
      password: "IamWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaayTooLong",
      email: "hello@world.com",
      lastTimeOnline: 1234,
      currentPlanet: 45312,
      bTechID: 0,
      bTechEndTime: 0,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (email too long)", function() {
    const data = {
      userID: 1,
      username: "Testname",
      password: "iAmNotSecure",
      email: "hello@IamWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaayTooLong.com",
      lastTimeOnline: 1234,
      currentPlanet: 45312,
      bTechID: 0,
      bTechEndTime: 0,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (lastTimeOnline negative)", function() {
    const data = {
      userID: 1,
      username: "Testname",
      password: "iAmNotSecure",
      email: "hello@world.com",
      lastTimeOnline: -1,
      currentPlanet: 45312,
      bTechID: 0,
      bTechEndTime: 0,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (currentPlanet negative)", function() {
    const data = {
      userID: 1,
      username: "Testname",
      password: "iAmNotSecure",
      email: "hello@world.com",
      lastTimeOnline: 1,
      currentPlanet: -45312,
      bTechID: 0,
      bTechEndTime: 0,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (currentPlanet negative)", function() {
    const data = {
      userID: 1,
      username: "Testname",
      password: "iAmNotSecure",
      email: "hello@world.com",
      lastTimeOnline: 1,
      currentPlanet: -45312,
      bTechID: 0,
      bTechEndTime: 0,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (bTechID negative)", function() {
    const data = {
      userID: 1,
      username: "Testname",
      password: "iAmNotSecure",
      email: "hello@world.com",
      lastTimeOnline: 1,
      currentPlanet: -45312,
      bTechID: -1,
      bTechEndTime: 0,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (bTechID too high)", function() {
    const data = {
      userID: 1,
      username: "Testname",
      password: "iAmNotSecure",
      email: "hello@world.com",
      lastTimeOnline: 1,
      currentPlanet: -45312,
      bTechID: Globals.MAX_TECHNOLOGY_ID + 1,
      bTechEndTime: 0,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (bTechEndTime negative)", function() {
    const data = {
      userID: 1,
      username: "Testname",
      password: "iAmNotSecure",
      email: "hello@world.com",
      lastTimeOnline: 1,
      currentPlanet: -45312,
      bTechID: 0,
      bTechEndTime: -1,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });
});
