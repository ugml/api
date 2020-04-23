import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";
import Planet from "../units/Planet";
import SimpleLogger from "../loggers/SimpleLogger";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App(container, new SimpleLogger()).express;

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("shipsRouter", () => {
  let planetBeforeTests: Planet;

  before(async () => {
    planetBeforeTests = await container.planetService.getPlanet(1, 167546850, true);
    return request
      .post("/v1/auth/login")
      .send({ email: "user_1501005189510@test.com", password: "admin" })
      .then(res => {
        authToken = res.body.token;
      });
  });

  after(async () => {
    await container.planetService.updatePlanet(planetBeforeTests);
  });

  beforeEach(function() {
    request = chai.request(app);
    return;
  });

  it("should return a list of ships on the planet", () => {
    const planetID = 167546850;
    return request
      .get(`/v1/ships/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.planetID).to.be.equals(planetID);
      });
  });

  it("should fail (planetID invalid)", () => {
    const planetID = "asdf";
    return request
      .get(`/v1/ships/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (planetID invalid)", () => {
    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID: "sadf", buildOrder: { 201: 3 } })
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (invalid build-order, wrong unit-key)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: { hallo: 3 } })
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (invalid build-order, wrong amount)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: { 201: "asdf" } })
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (invalid build-order, not a ship)", () => {
    const planetID = 167546850;

    /* eslint-disable quotes */
    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: '{ "301": 3000 }' })
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
    /* eslint-enable quotes */
  });

  it("should fail (player does not own the planet)", () => {
    const planetID = 21234;

    /* eslint-disable quotes */
    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: '{ "201": 3000 }' })
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("The player does not own the planet");
      });
    /* eslint-enable quotes */
  });

  it("should fail (shipyard is upgrading)", async () => {
    const planetID = 167546850;

    const planet: Planet = await container.planetService.getPlanet(1, planetID, true);

    const valueBefore = planet.bHangarPlus;

    planet.bHangarPlus = true;

    await container.planetService.updatePlanet(planet);

    /* eslint-disable quotes */
    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: '{ "201": 3000 }' })
      .then(async res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Shipyard is currently upgrading");

        // reset
        planet.bHangarPlus = valueBefore;
        await container.planetService.updatePlanet(planet);
      });
    /* eslint-enable quotes */
  });

  it("should add a new build-order", () => {
    const planetID = 167546850;

    /* eslint-disable quotes */
    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: '{ "201": 4 }' })
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.planetID).to.be.equals(planetID);
        const buildOrders = JSON.parse(res.body.bHangarQueue);
        expect(buildOrders.length).to.be.equals(1);
      });
    /* eslint-enable quotes */
  });

  // TODO:
  // /v1/ships/build/
});
