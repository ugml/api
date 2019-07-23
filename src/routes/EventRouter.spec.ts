import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";

const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App(container).express;

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("eventRouter", () => {
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

  it("should return a planet", () => {
    return request
      .get("/v1/galaxy/7/5")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.type).to.eql("application/json");
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.body.data).to.have.lengthOf(2);
        expect(res.body.data[0].planetID).to.be.equals(61614);
        expect(res.body.data[0].galaxy).to.be.equals(7);
        expect(res.body.data[0].system).to.be.equals(5);
        expect(res.body.data[1].planetID).to.be.equals(87851);
        expect(res.body.data[1].galaxy).to.be.equals(7);
        expect(res.body.data[1].system).to.be.equals(5);
      });
  });
});
