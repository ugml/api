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

describe("defenseRoute", () => {
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

  it("should return a list of defenses", () => {
    const planetID = 167546850;

    return request
      .get(`/v1/defenses/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.planetID).equals(planetID);
      });
  });

  it("should return an empty list", () => {
    const planetID = 60881;

    return request
      .get(`/v1/defenses/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.NOT_AUTHORIZED);
        expect(res.type).to.eql("application/json");
      });
  });

  it("should fail (invalid planetID)", () => {
    return request
      .get("/v1/defenses/asdf")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
      });
  });

  it("should build multiple defenses", () => {
    const planetID = 167546850;

    return request
      .post("/v1/defenses/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: JSON.stringify({ 301: 1, 302: 1, 309: 1, 310: 1 }) })
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.planetID).equals(planetID);
      });
  });

  it("should build defense", () => {
    const planetID = 167546850;

    return request
      .post("/v1/defenses/build")
      .set("Authorization", authToken)
      .send({ planetID, buildOrder: JSON.stringify({ 310: 10000 }) })
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.planetID).equals(planetID);
      });
  });

  it("should fail (missing planetID-parameter)", () => {
    return request
      .post("/v1/defenses/build")
      .set("Authorization", authToken)
      .send({ buildOrder: JSON.stringify({ 301: 1 }) })
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (missing buildOrder-parameter)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/defenses/build")
      .set("Authorization", authToken)
      .send({ planetID })
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (no parameter)", () => {
    return request
      .post("/v1/defenses/build")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
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
          expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
          expect(res.body.error).to.be.equals("Invalid parameter");
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
          expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
          expect(res.body.error).to.be.equals("The player does not own the planet");
        })
    );
  });

  it("should fail (shipyard is currently upgrading)", async () => {
    const planetID = 167546850;

    const planet: Planet = await planetRepository.getById(planetID);

    const valueBefore = planet.bHangarPlus;

    planet.bHangarPlus = true;

    await planetRepository.save(planet);

    return (
      request
        .post("/v1/defenses/build")
        .set("Authorization", authToken)
        // eslint-disable-next-line prettier/prettier
        .send({ planetID, buildOrder: "{ \"301\": 1 }" })
        .then(async res => {
          expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
          expect(res.body.error).to.be.equals("Shipyard is currently upgrading");

          planet.bHangarPlus = valueBefore;
          await planetRepository.save(planet);
        })
    );
  });
});
