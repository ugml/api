import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";
import SimpleLogger from "../loggers/SimpleLogger";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App().express;

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("galaxyRouter", () => {
  before(() => {
    return request
      .post("/v1/login")
      .send({ email: "user_1501005189510@test.com", password: "admin" })
      .then(res => {
        authToken = res.body.token;
      });
  });

  beforeEach(function() {
    request = chai.request(app);
    return;
  });

  it("should return a list of galaxy-entries", () => {
    return request
      .get("/v1/galaxy/7/5")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.type).to.eql("application/json");
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.body).to.have.lengthOf(2);
        expect(res.body[0].planetID).to.be.equals(61614);
        expect(res.body[0].posGalaxy).to.be.equals(7);
        expect(res.body[0].posSystem).to.be.equals(5);
        expect(res.body[1].planetID).to.be.equals(87851);
        expect(res.body[1].posGalaxy).to.be.equals(7);
        expect(res.body[1].posSystem).to.be.equals(5);
      });
  });

  it("should fail (galaxy below lower bounds)", () => {
    return request
      .get("/v1/galaxy/-1/4")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.eql("Invalid parameter");
      });
  });

  it("should fail (invalid galaxy)", () => {
    return request
      .get("/v1/galaxy/asdf/4")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.eql("Invalid parameter");
      });
  });

  it("should fail (invalid system)", () => {
    return request
      .get("/v1/galaxy/1/asdf")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.eql("Invalid parameter");
      });
  });

  it("should return empty result", () => {
    return request
      .get("/v1/galaxy/9/100")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body).to.be.eql([]);
      });
  });

  it("should fail (galaxy above upper bounds)", () => {
    return request
      .get("/v1/galaxy/9999/4")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.eql("Invalid parameter");
      });
  });

  it("should fail (system below lower bounds)", () => {
    return request
      .get("/v1/galaxy/4/-1")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.eql("Invalid parameter");
      });
  });

  it("should fail (system above upper bounds)", () => {
    return request
      .get("/v1/galaxy/4/9999")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.eql("Invalid parameter");
      });
  });
});
