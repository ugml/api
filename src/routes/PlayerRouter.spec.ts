import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request(app);

describe("Player Routes", () => {

  it("should create a player", async () => {
    const user = {
      username: "Test2",
      password: "test",
      email: "test",
    };
    return request.post("/v1/users/create/").send(user).then(res => {
      expect(res.type).to.eql("application/json");
      console.log("player creation response", res.body)
    });
  });

  it.skip("should have a message prop", () => {
    return request.get("/v1/").then(res => {
      console.log(res.body.message);
      expect(res.body.message).to.eql("Hello World!");
    });
  });
});
