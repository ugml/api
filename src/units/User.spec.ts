import * as chai from "chai";
import SerializationHelper from "../common/SerializationHelper";
import User from "./User";

const assert = chai.assert;

describe("User-units", function() {
  it("user should be valid", function() {
    const data = {
      userID: 1,
      username: "Testuser",
      password: "iAmNotSecure",
      email: "hello@world.com",
      last_time_online: 1234,
      current_planet: 45312,
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
      last_time_online: 1234,
      current_planet: 45312,
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
      last_time_online: 1234,
      current_planet: 45312,
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
      last_time_online: 1234,
      current_planet: 45312,
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
      last_time_online: 1234,
      current_planet: 45312,
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
      last_time_online: 1234,
      current_planet: 45312,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (last_time_online negative)", function() {
    const data = {
      userID: 1,
      username: "Testname",
      password: "iAmNotSecure",
      email: "hello@world.com",
      last_time_online: -1,
      current_planet: 45312,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (current_planet negative)", function() {
    const data = {
      userID: 1,
      username: "Testname",
      password: "iAmNotSecure",
      email: "hello@world.com",
      last_time_online: 1,
      current_planet: -45312,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (current_planet negative)", function() {
    const data = {
      userID: 1,
      username: "Testname",
      password: "iAmNotSecure",
      email: "hello@world.com",
      last_time_online: 1,
      current_planet: -45312,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });
});
