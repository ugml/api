/* eslint-disable @typescript-eslint/no-var-requires */
import "reflect-metadata";
import AuthService from "./AuthService";
import IUserService from "../interfaces/services/IUserService";
import { anyString, instance, mock, when } from "ts-mockito";
import User from "../units/User";
import UserService from "./UserService";
import ApiException from "../exceptions/ApiException";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
chai.use(chaiAsPromised);

describe("AuthService", () => {
  it("should return a token", async () => {
    const mockedFoo: IUserService = mock(UserService);

    when(mockedFoo.getUserForAuthentication(anyString())).thenResolve({
      username: "Admin",
      password: "$2b$10$l37H7il.konAYEMjLw.qWudFesOPSaKjtGj6VGw11Ogrqhxiq8Sf2",
      email: "foo@bar.at",
    } as User);

    const service = new AuthService(instance(mockedFoo));

    const token = await service.authenticateUser("foo@bar.at", "secret");

    expect(token).to.not.be.null;
  });

  it("should fail (user does not exist)", async () => {
    const mockedFoo: IUserService = mock(UserService);

    when(mockedFoo.getUserForAuthentication(anyString())).thenResolve(null);

    const service = new AuthService(instance(mockedFoo));

    await expect(service.authenticateUser("foo@bar.at", "secret")).to.be.rejectedWith(ApiException);
  });

  it("should fail (wrong password)", async () => {
    const mockedFoo: IUserService = mock(UserService);

    when(mockedFoo.getUserForAuthentication(anyString())).thenResolve({
      username: "Admin",
      password: "$2b$10$l37H7il.konAYEMjLw.qWudFesOPSaKjtGj6VGw11Ogrqhxiq8Sf2",
      email: "foo@bar.at",
    } as User);

    const service = new AuthService(instance(mockedFoo));

    await expect(service.authenticateUser("foo@bar.at", "somethingElse")).to.be.rejectedWith(ApiException);
  });
});
