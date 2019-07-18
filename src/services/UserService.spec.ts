import * as chai from "chai";
import { UserService } from "./UserService";

const expect = chai.expect;

describe("UserService", () => {
  it("should return a valid userID", async () => {
    const result = await this.userService.getNewId();

    expect(result).to.be.above(0);
  });

  it("should return information about an authenticated user", async () => {
    const userID = 1;

    const result = await this.userService.getAuthenticatedUser(userID);

    expect(result.userID).to.be.equals(userID);
    expect(result.username).to.be.equals("admin");
    expect(result.email).to.be.equals("user_1501005189510@test.com");
    expect(result.onlinetime).to.not.be.equals(null);
    expect(result.currentplanet).to.be.equals(167546850);
  });

  it("should return information about an user", async () => {
    const userID = 1;

    const result = await this.userService.getUserById(userID);

    expect(result.userID).to.be.equals(userID);
    expect(result.username).to.be.equals("admin");
    expect(result.email).to.be.equals(undefined);
    expect(result.onlinetime).to.be.equals(undefined);
    expect(result.currentplanet).to.be.equals(undefined);
  });

  it("should return nothing because the user does not exist", async () => {
    const userID = -1;

    const result = await this.userService.getUserById(userID);

    expect(result).to.be.equals(null);
  });

  it("should return all informations about a user", async () => {
    const email = "user_1501005189510@test.com";
    const userID = 1;

    const result = await this.userService.getUserForAuthentication(email);

    expect(result.userID).to.be.equals(userID);
    expect(result.email).to.be.equals(email);
    expect(result.password).to.be.not.equals(null);
  });

  it("should return nothing because the user does not exist", async () => {
    const email = "idontexist@test.com";

    const result = await this.userService.getUserForAuthentication(email);

    expect(result).to.be.equals(null);
  });

  it("should return nothing because the user does not exist", async () => {
    const userID = -1;

    const result = await this.userService.getUserById(userID);

    expect(result).to.be.equals(null);
  });

  it("should return username taken and email taken", async () => {
    const username = "admin";
    const email = "user_1501005189510@test.com";

    const result = await this.userService.checkIfNameOrMailIsTaken(username, email);

    expect(result.username_taken).to.be.equals(1);
    expect(result.email_taken).to.be.equals(1);
  });

  it("should return username free and email free", async () => {
    const username = "WhatEver";
    const email = "whatever@test.com";

    const result = await this.userService.checkIfNameOrMailIsTaken(username, email);

    expect(result.username_taken).to.be.equals(0);
    expect(result.email_taken).to.be.equals(0);
  });
});
