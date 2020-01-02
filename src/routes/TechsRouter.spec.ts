import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";
import IPlanetService from "../interfaces/IPlanetService";
import Planet from "../units/Planet";

const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App(container).express;

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("techsRouter", () => {
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

  it("should return a list of technologies", () => {
    return request
      .get("/v1/techs/")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.data.userID).to.be.equals(1);
        expect(res.body.data.graviton_tech).to.be.equals(1);
      });
  });

  it("should fail (missing techID-parameter)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.data).to.be.eql({});
      });
  });

  it("should fail (missing planetID-parameter)", () => {
    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ techID: 1 })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.data).to.be.eql({});
      });
  });

  it("should fail (techID is negative)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID, techID: -1 })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.data).to.be.eql({});
      });
  });

  it("should fail (techID is higher than global maximum)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID, techID: 500 })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.data).to.be.eql({});
      });
  });

  it("should fail (player does not own planet)", () => {
    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID: 1234, techID: 101 })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.data).to.be.eql({});
      });
  });

  it("start a tech-build-order", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID, techID: 101 })
      .then(res => {
        expect(res.body.message).equals("Job started");
        expect(res.status).to.equals(Globals.Statuscode.SUCCESS);
        expect(res.body.data.planet.planetID).to.be.equals(planetID);
      });
  });

  it("try to start another tech-build-order", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, techID: "101" })
      .then(res => {
        expect(res.body.message).equals("Planet already has a build-job");
        expect(res.body.status).equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.data).to.be.eql({});
      });
  });

  it("try to start a tech-build-order while research-lab is upgrading", async () => {
    const planetID = 167546850;

    const planetBackup: Planet = await container.planetService.getPlanet(1, planetID, true);
    const planet: Planet = await container.planetService.getPlanet(1, planetID, true);

    planet.b_building_id = Globals.Buildings.RESEARCH_LAB;
    planet.b_building_endtime = 1;

    await container.planetService.updatePlanet(planet);

    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, techID: "101" })
      .then(async res => {
        expect(res.body.message).equals("Planet is upgrading the research-lab");
        expect(res.body.status).equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.data).to.be.eql({});

        // reset
        await container.planetService.updatePlanet(planetBackup);
      });
  });

  it("should fail (invalid planetID)", () => {
    const planetID = "test";

    return request
      .post("/v1/techs/cancel")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, techID: "101" })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.data).to.be.eql({});
      });
  });

  it("cancel the tech-build-order", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/cancel")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, techID: "101" })
      .then(res => {
        expect(res.body.message).equals("Tech canceled");
        expect(res.status).to.equals(Globals.Statuscode.SUCCESS);
      });
  });

  it("should fail (user does not own the planet)", () => {
    const planetID = 1234;

    return request
      .post("/v1/techs/cancel")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, techID: "1101" })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.data).to.be.eql({});
      });
  });

  it("try cancel the build-order again", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/cancel")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, techID: "1" })
      .then(res => {
        expect(res.body.message).equals("Planet has no build-job");
        expect(res.status).to.equals(Globals.Statuscode.SUCCESS);
        expect(res.body.data).to.be.eql({});
      });
  });
});
