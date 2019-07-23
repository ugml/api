import * as chai from "chai";
import SerializationHelper from "../common/SerializationHelper";
import Buildings from "./Buildings";
import User from "./User";

const assert = chai.assert;

describe("User-units", function() {
  it("user should be valid", function() {
    const data = {
      userID: 1,
      username: "Testuser",
      password: "iAmNotSecure",
      email: "hello@world.com",
      onlinetime: 1234,
      currentplanet: 45312,
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
      onlinetime: 1234,
      currentplanet: 45312,
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
      onlinetime: 1234,
      currentplanet: 45312,
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
      onlinetime: 1234,
      currentplanet: 45312,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (password too long)", function() {
    const data = {
      userID: 1,
      username: "Test",
      password: "IamWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaayTooLong",
      email: "hello@world.com",
      onlinetime: 1234,
      currentplanet: 45312,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (email too long)", function() {
    const data = {
      userID: 1,
      username: "Test",
      password: "iAmNotSecure",
      email: "hello@IamWaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaayTooLong.com",
      onlinetime: 1234,
      currentplanet: 45312,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (onlinetime negative)", function() {
    const data = {
      userID: 1,
      username: "Test",
      password: "iAmNotSecure",
      email: "hello@world.com",
      onlinetime: -1,
      currentplanet: 45312,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });

  it("Should fail (currentplanet negative)", function() {
    const data = {
      userID: 1,
      username: "Test",
      password: "iAmNotSecure",
      email: "hello@world.com",
      onlinetime: 1,
      currentplanet: -45312,
    };

    const user: User = SerializationHelper.toInstance(new User(), JSON.stringify(data));

    assert.equal(user.isValid(), false);
  });
});
