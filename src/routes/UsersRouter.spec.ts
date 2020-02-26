import * as chai from "chai";

import App from "../App";
import { Globals } from "../common/Globals";
import chaiHttp = require("chai-http");
import SimpleLogger from "../loggers/SimpleLogger";

const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App(container, new SimpleLogger()).express;

chai.use(chaiHttp);
const expect = chai.expect;

describe("User Routes", () => {
  let authToken = "";
  let request = chai.request(app);

  before(() => {
    return request
      .post("/v1/auth/login")
      .send({ email: "user_1501005189510@test.com", password: "admin" })
      .then(res => {
        authToken = res.body.token;
      });
  });

  beforeEach(function() {
    request = chai.request(app);
    return;
  });

  it("should create a user", async () => {
    const user = {
      username: "IDoNotExistYet",
      password: "test",
      email: "iamnotareal@email.com",
    };

    container.galaxyService.getFreePosition = function() {
      return {
        posGalaxy: 1,
        posSystem: 1,
        posPlanet: 1,
        type: 1,
      };
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body).to.have.keys("userID", "token");
    expect(body.token.length).to.be.above(120);
  });

  it("should fail (username already taken)", async () => {
    const user = {
      username: "admin",
      password: "test",
      email: "test@test.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.error).to.be.equals("There was an error while handling the request: Username is already taken");
  });

  it("should fail (email already taken)", async () => {
    const user = {
      username: "testuser1234",
      password: "test",
      email: "L17@WEC.test",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.error).to.be.equals("There was an error while handling the request: Email is already taken");
  });

  it("user-creation should fail (invalid parameters)", async () => {
    const user = {
      username: "IDoNotExistYet",
      password: "test",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.error).to.be.equals("Invalid parameter");
  });

  it("user-creation should fail (invalid parameters)", async () => {
    const user = {
      username: "IDoNotExistYet",
      email: "iamnotareal@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.error).to.be.equals("Invalid parameter");
  });

  it("user-creation should fail (invalid parameters)", async () => {
    const user = {
      password: "test",
      email: "iamnotareal@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.error).to.be.equals("Invalid parameter");
  });

  it("user-creation should fail (no data sent)", async () => {
    const { type, status, body } = await request.post("/v1/users/create/");

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.error).to.be.equals("Invalid parameter");
  });

  it("should return the user", async () => {
    const { type, status, body } = await request.get("/v1/user/").set("Authorization", authToken);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.userID).to.be.equals(1);
    expect(body.username).to.not.be.equals(null);
    expect(body.email).to.not.be.equals(null);
    expect(body.lastTimeOnline).to.not.be.equals(null);
    expect(body.currentPlanet).to.not.be.equals(null);
  });

  it("should return a user", async () => {
    const { type, status, body } = await request.get("/v1/users/41").set("Authorization", authToken);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.userID).to.be.equals(41);
    expect(body.username).to.not.be.equals(null);
    expect(body.email).to.be.equals(undefined);
    expect(body.lastTimeOnline).to.be.equals(undefined);
    expect(body.currentPlanet).to.be.equals(undefined);
  });

  it("should fail (invalid userID)", async () => {
    const { type, status, body } = await request.get("/v1/users/asdf").set("Authorization", authToken);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.error).to.be.equals("Invalid parameter");
  });

  it("should return nothing (user does not exist)", async () => {
    const { type, status, body } = await request.get("/v1/users/2").set("Authorization", authToken);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
  });

  it("should update the user", async () => {
    const user = {
      username: "testuser1234",
    };

    const { type, status, body } = await request
      .post("/v1/user/update")
      .set("Authorization", authToken)
      .send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.userID).to.be.equals(1);
    expect(body.username).to.be.equals("testuser1234");

    // reset to old state
    request = chai.request(app);
    await request
      .post("/v1/user/update")
      .set("Authorization", authToken)
      .send({ username: "admin" });
  });

  it("update should fail (no data sent)", async () => {
    const { type, status, body } = await request.post("/v1/user/update").set("Authorization", authToken);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.error).to.be.equals("No parameters were passed");
  });

  it("update should fail (username already taken)", async () => {
    const user = {
      username: "LGY2Y37244",
    };

    const { type, status, body } = await request
      .post("/v1/user/update")
      .set("Authorization", authToken)
      .send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.error).contain("There was an error while handling the request: ");
  });

  it("update should fail (email already taken)", async () => {
    const user = {
      email: "L17@WEC.test",
    };

    const { type, status, body } = await request
      .post("/v1/user/update")
      .set("Authorization", authToken)
      .send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.error).contain("There was an error while handling the request: ");
  });

  it("update password", async () => {
    const user = {
      password: "admin",
    };

    const { type, status, body } = await request
      .post("/v1/user/update")
      .set("Authorization", authToken)
      .send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.userID).to.be.equals(1);
    expect(body.username).to.be.equals("admin");
  });
});
