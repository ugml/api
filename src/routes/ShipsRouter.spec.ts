import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";
import Planet from "../units/Planet";
import { iocContainer } from "../ioc/inversify.config";
import TYPES from "../ioc/types";
import IPlanetRepository from "../interfaces/repositories/IPlanetRepository";

const planetRepository = iocContainer.get<IPlanetRepository>(TYPES.IPlanetRepository);

const app = new App().express;

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("shipsRouter", () => {
  let planetBeforeTests: Planet;

  before(async () => {
    planetBeforeTests = await planetRepository.getById(167546850);
    return request
      .post("/v1/login")
      .send({ email: "user_1501005189510@test.com", password: "admin" })
      .then(res => {
        authToken = res.body.token;
      });
  });

  after(async () => {
    await planetRepository.save(planetBeforeTests);
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
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
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
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Validation failed");
      });
  });

  it("should fail (planetID invalid)", () => {
    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID: "sadf", buildOrder: [{ unitID: 201, amount: 3 }] })
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Validation failed");
      });
  });

  it("should fail (invalid build-order, wrong unit-key)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: [{ hallo: 3 }] })
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Validation failed");
      });
  });

  it("should fail (invalid build-order, wrong amount)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: [{ unitID: 201, amount: "asdf" }] })
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Validation failed");
      });
  });

  it("should fail (invalid build-order, not a ship)", () => {
    const planetID = 167546850;

    /* eslint-disable quotes */
    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: [{ unitID: 301, amount: 3000 }] })
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
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
      .send({ planetID, buildOrder: [{ unitID: 201, amount: 3000 }] })
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Planet does not exist");
      });
    /* eslint-enable quotes */
  });

  it("should fail (shipyard is upgrading)", async () => {
    const planetID = 167546850;

    const planet: Planet = await planetRepository.getById(planetID);

    const valueBefore = planet.bHangarPlus;

    planet.bHangarPlus = true;

    await planetRepository.save(planet);

    /* eslint-disable quotes */
    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: [{ unitID: 201, amount: 3000 }] })
      .then(async res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Shipyard is currently upgrading");

        planet.bHangarPlus = valueBefore;
        await planetRepository.save(planet);
      });
    /* eslint-enable quotes */
  });

  it("should add a new build-order", () => {
    const planetID = 167546850;

    /* eslint-disable quotes */
    return request
      .post("/v1/ships/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: [{ unitID: 201, amount: 4 }] })
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
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
