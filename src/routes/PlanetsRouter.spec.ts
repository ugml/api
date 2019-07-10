import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";
import { Globals } from "../common/Globals";

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("planetsRouter", () => {
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

  it("should set the current planet", () => {
    return request
      .post("/v1/user/currentplanet/set")
      .send({ planetID: 167546850 })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
      });
  });

  it("should fail (parameter planet-id missing)", () => {
    return request
      .post("/v1/user/currentplanet/set")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.message).to.be.equals("Invalid parameter");
        expect(res.type).to.eql("application/json");
      });
  });

  it("should fail (player does not own the planet)", () => {
    return request
      .post("/v1/user/currentplanet/set")
      .send({ planetID: 1 })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.message).to.be.equals("The player does not own the planet");
        expect(res.type).to.eql("application/json");
      });
  });

  it("should return a list of planets", () => {
    return request
      .get("/v1/planets/planetlist/")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.data[0][0].planetID).to.not.be.null;
      });
  });

  it("should return nothing", () => {
    return request
      .get("/v1/user/planet/1234")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.data).to.be.empty;
      });
  });

  it("should return a planet", () => {
    const planetID = 167546850;

    return request
      .get(`/v1/user/planet/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.data[0].planetID).to.be.equals(planetID);
      });
  });

  it("should fail (invalid planet-id)", () => {
    const planetID = "asdf";

    return request
      .get(`/v1/user/planet/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.message).to.be.equals("Invalid parameter");
      });
  });

  it("should return a list of movements on the planet", () => {
    const planetID = 167546850;

    return request
      .get(`/v1/planets/movement/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        // TODO
      });
  });

  it("should rename a planet", () => {
    const planetID = 167546850;

    return request
      .post("/v1/planets/rename")
      .send({ planetID: planetID, name: "FancyNewName" })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.data.name).to.be.equals("FancyNewName");
      });
  });

  // TODO:
  // destroyPlanet  /destroy/
  // getPlanetByID  /:planetID
});
