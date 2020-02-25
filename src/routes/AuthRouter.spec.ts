import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";

const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App(container).express;

chai.use(chaiHttp);
const expect = chai.expect;

describe("authRoute", () => {
  // TODO properly initialize and tear down app with db connections to be able to remove mocha --exit flag!

  let request = chai.request(app);

  beforeEach(function() {
    request = chai.request(app);
  });

  it("should return a token", async () => {
    return await request
      .post("/v1/auth/login")
      .send({ email: "user_1501005189510@test.com", password: "admin" })
      .then(res => {
        expect(res.status).to.equals(Globals.Statuscode.SUCCESS);
        expect(res.body.token).to.not.be.equals(null);
      });
  });

  it("authentication should fail (user does not exist)", async () => {
    return request
      .post("/v1/auth/login")
      .send({ email: "idonotexist@test.com", password: "idontexisteither" })
      .then(res => {
        expect(res.body.error).equals("Authentication failed");
        expect(res.status).to.equals(Globals.Statuscode.NOT_AUTHORIZED);
      });
  });

  it("authentication should fail (no password sent)", async () => {
    return request
      .post("/v1/auth/login")
      .send({ email: "user_1501005189510@test.com" })
      .then(res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
      });
  });

  it("authentication should fail (no email sent)", async () => {
    return request
      .post("/v1/auth/login")
      .send({ password: "admin" })
      .then(res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
      });
  });

  it("authentication should fail (nothing sent)", async () => {
    return request.post("/v1/auth/login").then(res => {
      expect(res.body.error).equals("Invalid parameter");
      expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
    });
  });

  it("authentication should fail (wrong password)", async () => {
    return request
      .post("/v1/auth/login")
      .send({ email: "user_1501005189510@test.com", password: "iAmWrong" })
      .then(res => {
        expect(res.body.error).equals("Authentication failed");
        expect(res.status).to.equals(Globals.Statuscode.NOT_AUTHORIZED);
      });
  });
});
