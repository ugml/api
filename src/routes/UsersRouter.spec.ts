import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";
import { Globals } from "../common/Globals";

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
        authToken = res.body.data.token;
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

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser1",
      password: "test1",
      email: "test1@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser2",
      password: "test2",
      email: "test2@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser3",
      password: "test3",
      email: "test3@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser4",
      password: "test4",
      email: "test4@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser5",
      password: "test5",
      email: "test5@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser6",
      password: "test6",
      email: "test6@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser7",
      password: "test7",
      email: "test7@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser8",
      password: "test8",
      email: "test8@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser9",
      password: "test9",
      email: "test9@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser10",
      password: "test10",
      email: "test10@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser11",
      password: "test11",
      email: "test11@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser12",
      password: "test12",
      email: "test12@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser13",
      password: "test13",
      email: "test13@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser14",
      password: "test14",
      email: "test14@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });

  it("should create a user", async () => {
    const user = {
      username: "testuser15",
      password: "test15",
      email: "test15@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
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
    expect(body.message).to.be.equals("There was an error while handling the request: Username is already taken");
    expect(body.data).to.be.empty;
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
    expect(body.message).to.be.equals("There was an error while handling the request: Email is already taken");
    expect(body.data).to.be.empty;
  });

  it("user-creation should fail (invalid parameters)", async () => {
    const user = {
      username: "IDoNotExistYet",
      password: "test",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.message).to.be.equals("Invalid parameter");
    expect(body.data).to.be.empty;
  });

  it("user-creation should fail (invalid parameters)", async () => {
    const user = {
      username: "IDoNotExistYet",
      email: "iamnotareal@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.message).to.be.equals("Invalid parameter");
    expect(body.data).to.be.empty;
  });

  it("user-creation should fail (invalid parameters)", async () => {
    const user = {
      password: "test",
      email: "iamnotareal@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.message).to.be.equals("Invalid parameter");
    expect(body.data).to.be.empty;
  });

  it("user-creation should fail (no data sent)", async () => {
    const { type, status, body } = await request.post("/v1/users/create/");

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.message).to.be.equals("Invalid parameter");
    expect(body.data).to.be.empty;
  });

  it("should return the user", async () => {
    const { type, status, body } = await request.get("/v1/user/").set("Authorization", authToken);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data.userID).to.be.equals(1);
    expect(body.data.username).to.not.be.null;
    expect(body.data.email).to.not.be.null;
    expect(body.data.onlinetime).to.not.be.null;
    expect(body.data.currentplanet).to.not.be.null;
  });

  it("should return a user", async () => {
    const { type, status, body } = await request.get("/v1/users/41").set("Authorization", authToken);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data.userID).to.be.equals(41);
    expect(body.data.username).to.not.be.null;
    expect(body.data.email).to.be.equals(undefined);
    expect(body.data.onlinetime).to.be.equals(undefined);
    expect(body.data.currentplanet).to.be.equals(undefined);
  });

  it("should fail (invalid userID)", async () => {
    const { type, status, body } = await request.get("/v1/users/asdf").set("Authorization", authToken);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
    expect(body.message).to.be.equals("Invalid parameter");
    expect(body.data).to.be.empty;
  });

  it("should return nothing (user does not exist)", async () => {
    const { type, status, body } = await request.get("/v1/users/2").set("Authorization", authToken);

    expect(type).to.be.equals("application/json");
    expect(status).to.be.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.be.empty;
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
    expect(body.data.userID).to.be.equals(1);
    expect(body.data.username).to.be.equals("testuser1234");

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
    expect(body.message).to.be.equals("No parameters were passed");
    expect(body.data).to.be.empty;
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
    expect(body.message).contain("There was an error while handling the request: ");
    expect(body.data).to.be.empty;
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
    expect(body.message).contain("There was an error while handling the request: ");
    expect(body.data).to.be.empty;
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
    expect(body.data.userID).to.be.equals(1);
    expect(body.data.username).to.be.equals("admin");
  });
});
