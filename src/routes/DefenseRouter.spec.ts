import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";
import Planet from "../units/Planet";

const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App(container).express;

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("defenseRoute", () => {
  let planetBeforeTests: Planet;

  before(async () => {
    planetBeforeTests = await container.planetService.getPlanet(1, 167546850, true);
    return request
      .post("/v1/auth/login")
      .send({ email: "user_1501005189510@test.com", password: "admin" })
      .then(res => {
        authToken = res.body.data.token;
      });
  });

  after(async () => {
    await container.planetService.updatePlanet(planetBeforeTests);
  });

  beforeEach(function() {
    request = chai.request(app);
    return;
  });

  it("should return a list of defenses", () => {
    const planetID = 167546850;

    return request
      .get(`/v1/defenses/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.data.planetID).equals(planetID);
      });
  });

  it("should return an empty list", () => {
    const planetID = 60881;

    return request
      .get(`/v1/defenses/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.data).to.be.eql({});
      });
  });

  it("should fail (invalid planetID)", () => {
    return request
      .get("/v1/defenses/asdf")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.message).to.be.equals("Invalid parameter");
        expect(res.body.data).to.be.eql({});
      });
  });

  it("should build defense", () => {
    const planetID = 167546850;

    return request
      .post("/v1/defenses/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: JSON.stringify({ 301: 10000 }) })
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.data.planetID).equals(planetID);
      });
  });

  it("should fail (missing planetID-parameter)", () => {
    return request
      .post("/v1/defenses/build")
      .set("Authorization", authToken)
      .send({ buildOrder: JSON.stringify({ 301: 1 }) })
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.data).to.be.eql({});
      });
  });

  it("should fail (missing buildOrder-parameter)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/defenses/build")
      .set("Authorization", authToken)
      .send({ planetID })
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.data).to.be.eql({});
      });
  });

  it("should fail (no parameter)", () => {
    return request
      .post("/v1/defenses/build")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.data).to.be.eql({});
      });
  });

  it("should fail (invalid buildOrder)", () => {
    const planetID = 167546850;

    return (
      request
        .post("/v1/defenses/build")
        .set("Authorization", authToken)
        // eslint-disable-next-line prettier/prettier
      .send({ planetID, buildOrder: "{ \"xyz\": 1 }" })
        .then(res => {
          expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
          expect(res.body.message).to.be.equals("Invalid parameter");
          expect(res.body.data).to.be.eql({});
        })
    );
  });

  it("should fail (player does not own the planet)", () => {
    const planetID = 1234;

    return (
      request
        .post("/v1/defenses/build")
        .set("Authorization", authToken)
        // eslint-disable-next-line prettier/prettier
        .send({ planetID, buildOrder: "{ \"301\": 1 }" })
        .then(res => {
          expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
          expect(res.body.message).to.be.equals("The player does not own the planet");
          expect(res.body.data).to.be.eql({});
        })
    );
  });

  it("should fail (shipyard is currently upgrading)", async () => {
    const planetID = 167546850;

    const planet: Planet = await container.planetService.getPlanet(1, planetID, true);

    const valueBefore = planet.b_hangar_plus;

    planet.b_hangar_plus = true;

    await container.planetService.updatePlanet(planet);

    return (
      request
        .post("/v1/defenses/build")
        .set("Authorization", authToken)
        // eslint-disable-next-line prettier/prettier
        .send({ planetID, buildOrder: "{ \"301\": 1 }" })
        .then(async res => {
          expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
          expect(res.body.message).to.be.equals("Shipyard is currently upgrading");
          expect(res.body.data).to.be.eql({});

          planet.b_hangar_plus = valueBefore;
          await container.planetService.updatePlanet(planet);
        })
    );
  });
});
