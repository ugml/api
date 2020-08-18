import * as chai from "chai";
import { iocContainer } from "../ioc/inversify.config";

import TYPES from "../ioc/types";
import IUserRepository from "../interfaces/repositories/IUserRepository";

const expect = chai.expect;

const userRepository = iocContainer.get<IUserRepository>(TYPES.IUserRepository);

describe("UserService", () => {
  it("should return a valid userID", async () => {
    const result = await userRepository.getNewId();

    expect(result).to.be.above(0);
  });

  it("should return information about an authenticated user", async () => {
    const userID = 1;

    const result = await userRepository.getById(userID);

    expect(result.userID).to.be.equals(userID);
    expect(result.username).to.be.equals("admin");
    expect(result.email).to.be.equals("user_1501005189510@test.com");
    expect(result.lastTimeOnline).to.not.be.equals(null);
    expect(result.currentPlanet).to.be.equals(167546850);
  });

  it("should return information about an user", async () => {
    const userID = 1;

    const result = await userRepository.getById(userID);

    expect(result.userID).to.be.equals(userID);
    expect(result.username).to.be.equals("admin");
  });

  it("should return nothing because the user does not exist", async () => {
    const userID = -1;

    const result = await userRepository.getById(userID);

    expect(result).to.be.equals(null);
  });

  it("should return all informations about a user", async () => {
    const email = "user_1501005189510@test.com";
    const userID = 1;

    const result = await userRepository.getById(userID);

    expect(result.userID).to.be.equals(userID);
    expect(result.email).to.be.equals(email);
    expect(result.password).to.be.not.equals(null);
  });

  it("should return nothing because the user does not exist", async () => {
    const userID = -1;

    const result = await userRepository.getById(userID);

    expect(result).to.be.equals(null);
  });

  it("should return nothing because the user does not exist", async () => {
    const userID = -1;

    const result = await userRepository.getById(userID);

    expect(result).to.be.equals(null);
  });

  it("should return username taken and email taken", async () => {
    const email = "user_1501005189510@test.com";

    const result = await userRepository.checkEmailTaken(email);

    expect(result).to.be.equals(true);
  });

  it("should return username free and email free", async () => {
    const username = "WhatEver";

    const result = await userRepository.checkUsernameTaken(username);

    expect(result).to.be.equals(false);
  });
});
