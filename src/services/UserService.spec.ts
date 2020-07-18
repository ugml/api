import * as chai from "chai";
import { iocContainer } from "../ioc/inversify.config";

import TYPES from "../ioc/types";
import IUserService from "../interfaces/services/IUserService";

const expect = chai.expect;

const userService = iocContainer.get<IUserService>(TYPES.IUserService);

describe("UserService", () => {
  it("should return a valid userID", async () => {
    const result = await userService.getNewId();

    expect(result).to.be.above(0);
  });

  it("should return information about an authenticated user", async () => {
    const userID = 1;

    const result = await userService.getAuthenticatedUser(userID);

    expect(result.userID).to.be.equals(userID);
    expect(result.username).to.be.equals("admin");
    expect(result.email).to.be.equals("user_1501005189510@test.com");
    expect(result.lastTimeOnline).to.not.be.equals(null);
    expect(result.currentPlanet).to.be.equals(167546850);
  });

  it("should return information about an user", async () => {
    const userID = 1;

    const result = await userService.getUserById(userID);

    expect(result.userID).to.be.equals(userID);
    expect(result.username).to.be.equals("admin");
  });

  it("should return nothing because the user does not exist", async () => {
    const userID = -1;

    const result = await userService.getUserById(userID);

    expect(result).to.be.equals(null);
  });

  it("should return all informations about a user", async () => {
    const email = "user_1501005189510@test.com";
    const userID = 1;

    const result = await userService.getUserForAuthentication(email);

    expect(result.userID).to.be.equals(userID);
    expect(result.email).to.be.equals(email);
    expect(result.password).to.be.not.equals(null);
  });

  it("should return nothing because the user does not exist", async () => {
    const email = "idontexist@test.com";

    const result = await userService.getUserForAuthentication(email);

    expect(result).to.be.equals(null);
  });

  it("should return nothing because the user does not exist", async () => {
    const userID = -1;

    const result = await userService.getUserById(userID);

    expect(result).to.be.equals(null);
  });

  it("should return username taken and email taken", async () => {
    const username = "admin";
    const email = "user_1501005189510@test.com";

    const result = await userService.checkIfNameOrMailIsTaken(username, email);

    expect(result.username_taken).to.be.equals(1);
    expect(result.email_taken).to.be.equals(1);
  });

  it("should return username free and email free", async () => {
    const username = "WhatEver";
    const email = "whatever@test.com";

    const result = await userService.checkIfNameOrMailIsTaken(username, email);

    expect(result.username_taken).to.be.equals(0);
    expect(result.email_taken).to.be.equals(0);
  });
});
