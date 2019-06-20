import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request(app);

describe("authRoute", () => {
  // TODO properly initialize and tear down app with db connections to be able to remove mocha --exit flag!

  it("should return a token", async () => {
    return request
      .post("/v1/auth/login")
      .send({ email: "user_1501005189510@test.com", password: "admin" })
      .then(res => {
        expect(res.body.message).equals("Success");
      });
  });

});
