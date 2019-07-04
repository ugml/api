import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";

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
        expect(res.body.message).equals("Success");
        expect(res.status).to.equals(200);
      });
  });

  it("authentication should fail", async () => {
    return request
      .post("/v1/auth/login")
      .send({ email: "idonotexist@test.com", password: "idontexisteither" })
      .then(res => {
        expect(res.body.message).equals("Authentication failed");
        expect(res.status).to.equals(401);
      });
  });

  it("authentication should fail (no password sent)", async () => {
    return request
      .post("/v1/auth/login")
      .send({ email: "user_1501005189510@test.com" })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.equals(400);
      });
  });

  it("authentication should fail (no email sent)", async () => {
    return request
      .post("/v1/auth/login")
      .send({ password: "admin" })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.equals(400);
      });
  });

  it("authentication should fail (nothing sent)", async () => {
    return request.post("/v1/auth/login").then(res => {
      expect(res.body.message).equals("Invalid parameter");
      expect(res.status).to.equals(400);
    });
  });
});
