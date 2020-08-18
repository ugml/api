/* eslint-disable @typescript-eslint/no-var-requires */
import AuthService from "./AuthService";
import IUserService from "../interfaces/services/IUserService";
import { anyString, instance, mock, when } from "ts-mockito";
import User from "../units/User";
import UserService from "./UserService";

import UnauthorizedException from "../exceptions/UnauthorizedException";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
chai.use(chaiAsPromised);

describe("AuthService", () => {
  it("should return a token", async () => {
    const userServiceMock: IUserService = mock(UserService);

    when(userServiceMock.getUserForAuthentication(anyString())).thenResolve({
      username: "Admin",
      password: "$2b$10$l37H7il.konAYEMjLw.qWudFesOPSaKjtGj6VGw11Ogrqhxiq8Sf2",
      email: "foo@bar.at",
    } as User);

    const service = new AuthService(instance(userServiceMock));

    const token = await service.authenticateUser("foo@bar.at", "secret");

    expect(token).to.not.be.null;
  });

  it("should fail (user does not exist)", async () => {
    const userServiceMock: IUserService = mock(UserService);

    when(userServiceMock.getUserForAuthentication(anyString())).thenResolve(null);

    const service = new AuthService(instance(userServiceMock));

    await expect(service.authenticateUser("foo@bar.at", "secret")).to.be.rejectedWith(UnauthorizedException);
  });

  it("should fail (wrong password)", async () => {
    const userServiceMock: IUserService = mock(UserService);

    when(userServiceMock.getUserForAuthentication(anyString())).thenResolve({
      username: "Admin",
      password: "$2b$10$l37H7il.konAYEMjLw.qWudFesOPSaKjtGj6VGw11Ogrqhxiq8Sf2",
      email: "foo@bar.at",
    } as User);

    const service = new AuthService(instance(userServiceMock));

    await expect(service.authenticateUser("foo@bar.at", "somethingElse")).to.be.rejectedWith(UnauthorizedException);
  });
});
