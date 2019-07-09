import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";
import { Globals } from "../common/Globals";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Player Routes", () => {
  let request;

  beforeEach(function() {
    request = chai.request(app);
  });

  it("should create a player", async () => {
    const user = {
      username: "IDoNotExistYet",
      password: "test",
      email: "iamnotareal@email.com",
    };

    const { type, status, body } = await request.post("/v1/users/create/").send(user);

    expect(type).to.equals("application/json");
    expect(status).to.equals(Globals.Statuscode.SUCCESS);
    expect(body.data).to.have.keys("userID", "token");
    expect(body.data.token.length).to.be.above(120);
  });
});
