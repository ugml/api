import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "./App";
import { Globals } from "./common/Globals";
import JwtHelper from "./common/JwtHelper";

const createContainer = require("./ioc/createContainer");

const app = new App(createContainer()).express;

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("App", () => {
  before(() => {
    return request
      .post("/v1/auth/login")
      .send({ email: "user_1501005189510@test.com ", password: "admin" })
      .then(res => {
        authToken = res.body.data.token;
      });
  });

  beforeEach(function() {
    request = chai.request(app);
    return;
  });

  it("should fail (not authorized)", () => {
    const planetID = 167546850;

    return request.get(`/v1/buildings/${planetID}`).then(res => {
      expect(res.status).to.equals(Globals.Statuscode.NOT_AUTHORIZED);
      expect(res.body.data).to.be.eql({});
      expect(res.body.message).to.be.equals("Authentication failed");
    });
  });

  it("should fail (invalid userID)", () => {
    const planetID = 167546850;
    return request
      .get(`/v1/buildings/${planetID}`)
      .set("Authorization", JwtHelper.generateToken(parseInt("iAmNotAValidUserId", 10)))
      .then(res => {
        expect(res.status).to.equals(Globals.Statuscode.NOT_AUTHORIZED);
        expect(res.body.data).to.be.eql({});
        expect(res.body.message).to.be.equals("Authentication failed");
      });
  });

  it("should fail (route does not exist)", () => {
    return request
      .get("/v1/idontexist")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.equals(Globals.Statuscode.NOT_FOUND);
        expect(res.body.data).to.be.eql({});
        expect(res.body.message).to.be.equals("The route does not exist");
      });
  });
});
