import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";
import { Globals } from "../common/Globals";

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("techsRouter", () => {
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

  it("should return a list of technologies", () => {
    return request
      .get("/v1/techs/")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.data.userID).to.be.equals(1);
        expect(res.body.data.graviton_tech).to.be.equals(1);
      });
  });

  // TODO:
  // /v1/techs/build/
  // /v1/techs/cancel/
});
