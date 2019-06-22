import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("buildingsRoute", () => {
  before(() => {
    request
      .post("/v1/auth/login")
      .send({ email: "user_1501005189510@test.com", password: "admin" })
      .then(res => {
        authToken = res.body.data.token;
      });
  });

  beforeEach(function() {
    request = chai.request(app);
  });

  it("should return a list of buildings", async () => {
    let planetID = 167546850;

    return request
      .get(`/v1/buildings/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.data.planetID).equals(planetID);
      });
  });
});
