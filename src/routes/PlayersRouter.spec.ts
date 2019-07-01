import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Player Routes", () => {
  let request = chai.request(app);

  beforeEach(function() {
    request = chai.request(app);
  });

  it("should create a player", done => {
    const user = {
      username: "Test4",
      password: "test",
      email: "test",
    };

    request
      .post("/v1/users/create/")
      .send(user)
      .then(res => {
        expect(res.type).to.eql("application/json");
        expect(res.status).to.eql(200);
      });

    done();
  });
});
