import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Player Routes", () => {
  let request;

  beforeEach(function() {
    request = chai.request(app);
  });

  it("should create a player", async () => {
    const user = {
      username: "Test4",
      password: "test",
      email: "test",
    };

    const { type, status } = await request.post("/v1/users/create/").send(user);

    expect(type).to.eql("application/json");
    expect(status).to.eql(200);
  });
});
