import * as chai from "chai";
import { UserService } from "./UserService";

const expect = chai.expect;

describe("UserService", () => {
  it("should return a valid userID", async () => {
    const result = await UserService.GetNewId();

    expect(result).to.be.above(0);
  });

  it("should return information about an authenticated user", async () => {
    const userID = 1;

    const result = await UserService.GetAuthenticatedUser(userID);

    expect(result.userID).to.be.equals(userID);
    expect(result.username).to.be.equals("admin");
    expect(result.email).to.be.equals("user_1501005189510@test.com");
    expect(result.onlinetime).to.not.be.null;
    expect(result.currentplanet).to.be.equals(167546850);
  });

  it("should return information about an user", async () => {
    const userID = 1;

    const result = await UserService.GetUserById(userID);

    expect(result.userID).to.be.equals(userID);
    expect(result.username).to.be.equals("admin");
    expect(result.email).to.be.undefined;
    expect(result.onlinetime).to.be.undefined;
    expect(result.currentplanet).to.be.undefined;
  });

  it("should return username taken and email taken", async () => {
    const username = "admin";
    const email = "user_1501005189510@test.com";

    const result = await UserService.CheckIfNameOrMailIsTaken(username, email);

    expect(result.username_taken).to.be.equals(1);
    expect(result.email_taken).to.be.equals(1);
  });

  it("should return username free and email free", async () => {
    const username = "WhatEver";
    const email = "whatever@test.com";

    const result = await UserService.CheckIfNameOrMailIsTaken(username, email);

    expect(result.username_taken).to.be.equals(0);
    expect(result.email_taken).to.be.equals(0);
  });
});
