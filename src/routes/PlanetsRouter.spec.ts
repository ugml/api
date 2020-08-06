import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";
import Planet from "../units/Planet";
import User from "../units/User";
import { iocContainer } from "../ioc/inversify.config";
import TYPES from "../ioc/types";
import IPlanetRepository from "../interfaces/repositories/IPlanetRepository";
import IUserRepository from "../interfaces/repositories/IUserRepository";

const planetRepository = iocContainer.get<IPlanetRepository>(TYPES.IPlanetRepository);
const userRepository = iocContainer.get<IUserRepository>(TYPES.IUserRepository);

const app = new App().express;

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("planetsRouter", () => {
  let authUserBeforeTests: User;
  let planetBeforeTests: Planet;

  before(async () => {
    authUserBeforeTests = await userRepository.getById(1);
    planetBeforeTests = await planetRepository.getById(167546850);
    return request
      .post("/v1/login")
      .send({ email: "user_1501005189510@test.com", password: "admin" })
      .then(res => {
        authToken = res.body.token;
      });
  });

  after(async () => {
    await userRepository.save(authUserBeforeTests);
    await planetRepository.save(planetBeforeTests);
  });

  beforeEach(function() {
    request = chai.request(app);
    return;
  });

  it("should set the current planet", () => {
    const planetID = 167546850;
    return request
      .post("/v1/user/currentplanet/set")
      .send({ planetID: planetID })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.currentPlanet).to.be.eql(planetID);
        expect(res.body.password).to.be.undefined;
      });
  });

  it("should fail (parameter planet-id missing)", () => {
    return request
      .post("/v1/user/currentplanet/set")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.body.error).to.be.equals("Invalid parameter");
        expect(res.type).to.eql("application/json");
      });
  });

  it("should fail (player does not own the planet)", () => {
    return request
      .post("/v1/user/currentplanet/set")
      .send({ planetID: 1 })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.body.error).to.be.equals("The player does not own the planet");
        expect(res.type).to.eql("application/json");
      });
  });

  it("should return a list of planets", () => {
    return request
      .get("/v1/user/planetlist/")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body[0].planetID).to.be.equals(167546850);
        expect(res.body[0].ownerID).to.be.equals(1);
        expect(res.body[0].posGalaxy).to.be.equals(9);
        expect(res.body[0].posSystem).to.be.equals(54);
        expect(res.body[0].posPlanet).to.be.equals(1);
        expect(res.body[0].metal).to.be.greaterThan(0);
        expect(res.body[0].crystal).to.be.greaterThan(0);
        expect(res.body[0].deuterium).to.be.greaterThan(0);
      });
  });

  it("should return a list of planets of an other user", () => {
    return request
      .get("/v1/user/planetlist/35")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body[0].planetID).to.be.equals(93133);
        expect(res.body[0].ownerID).to.be.equals(35);
        expect(res.body[0].posGalaxy).to.be.equals(4);
        expect(res.body[0].posSystem).to.be.equals(71);
        expect(res.body[0].posPlanet).to.be.equals(2);
        expect(res.body[0].metal).to.be.equals(undefined);
        expect(res.body[0].crystal).to.be.equals(undefined);
        expect(res.body[0].deuterium).to.be.equals(undefined);
      });
  });

  it("should return nothing", () => {
    return request
      .get("/v1/user/planet/1234")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body).to.be.empty;
      });
  });

  it("should return a planet owned by the user", () => {
    const planetID = 167546850;

    return request
      .get(`/v1/user/planet/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.planetID).to.be.equals(planetID);
        expect(res.body.ownerID).to.be.equals(1);
        expect(res.body.posGalaxy).to.be.equals(9);
        expect(res.body.posSystem).to.be.equals(54);
        expect(res.body.posPlanet).to.be.equals(1);
        expect(res.body.metal).to.be.greaterThan(0);
        expect(res.body.crystal).to.be.greaterThan(0);
        expect(res.body.deuterium).to.be.greaterThan(0);
      });
  });

  it("should fail (invalid planet-id)", () => {
    const planetID = "asdf";

    return request
      .get(`/v1/user/planet/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should return a list of movements on the planet", () => {
    const planetID = 167546850;

    return request
      .get(`/v1/planets/movement/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        // TODO
      });
  });

  it("should fail (invalid planetID passed)", () => {
    const planetID = "aa";

    return request
      .get(`/v1/planets/movement/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should rename a planet", async () => {
    const planetID = 167546850;

    const planet: Planet = await planetRepository.getById(planetID);

    return request
      .post("/v1/planets/rename")
      .send({ planetID, name: "FancyNewName" })
      .set("Authorization", authToken)
      .then(async res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.name).to.be.equals("FancyNewName");

        // reset
        await planetRepository.save(planet);
      });
  });

  it("should fail (name not passed)", async () => {
    const planetID = 167546850;

    return request
      .post("/v1/planets/rename")
      .send({ planetID })
      .set("Authorization", authToken)
      .then(async res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (planerID not passed)", async () => {
    return request
      .post("/v1/planets/rename")
      .send({ name: "NewName" })
      .set("Authorization", authToken)
      .then(async res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (planerID not passed)", async () => {
    const planetID = 167546850;

    return request
      .post("/v1/planets/rename")
      .send({ planetID, name: "A" })
      .set("Authorization", authToken)
      .then(async res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("New name is too short");
      });
  });

  it("should fail (invalid planetID passed)", () => {
    const planetID = "asdf";

    return request
      .get(`/v1/planets/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should return a planet of another player", () => {
    const planetID = 167546850;

    return request
      .get(`/v1/planets/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.planetID).to.be.equals(planetID);
      });
  });

  it("should fail (nothing sent)", () => {
    return request
      .post("/v1/planets/destroy/")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (invalid planetID)", () => {
    const planetID = "asdf";

    return request
      .post("/v1/planets/destroy/")
      .set("Authorization", authToken)
      .send({ planetID })
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  let secondPlanetBackup: Planet;

  it("should delete the planet", async () => {
    const planetID = 167546999;

    secondPlanetBackup = await planetRepository.getById(planetID);

    return request
      .post("/v1/planets/destroy/")
      .set("Authorization", authToken)
      .send({ planetID })
      .then(async res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
      });
  });

  it("should fail (last planet can't be deleted)", async () => {
    const planetID = 167546850;

    return request
      .post("/v1/planets/destroy/")
      .set("Authorization", authToken)
      .send({ planetID })
      .then(async res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("The last planet cannot be destroyed");
        await planetRepository.create(secondPlanetBackup);
      });
  });
});
