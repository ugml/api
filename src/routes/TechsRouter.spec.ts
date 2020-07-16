import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";
import Planet from "../units/Planet";
import SimpleLogger from "../loggers/SimpleLogger";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App().express;

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("techsRouter", () => {
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

  it("should return a list of technologies", () => {
    return request
      .get("/v1/techs/")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.StatusCodes.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.userID).to.be.equals(1);
        expect(res.body.gravitonTech).to.be.equals(1);
      });
  });

  it("should fail (missing techID-parameter)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID })
      .then(res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.StatusCodes.BAD_REQUEST);
      });
  });

  it("should fail (missing planetID-parameter)", () => {
    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ techID: 1 })
      .then(res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.StatusCodes.BAD_REQUEST);
      });
  });

  it("should fail (techID is negative)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID, techID: -1 })
      .then(res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.StatusCodes.BAD_REQUEST);
      });
  });

  it("should fail (techID is higher than global maximum)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID, techID: 500 })
      .then(res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.StatusCodes.BAD_REQUEST);
      });
  });

  it("should fail (player does not own planet)", () => {
    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID: 1234, techID: 101 })
      .then(res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.StatusCodes.BAD_REQUEST);
      });
  });

  it("start a tech-build-order", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID, techID: 101 })
      .then(res => {
        expect(res.status).to.equals(Globals.StatusCodes.SUCCESS);
        expect(res.body.planetID).to.be.equals(planetID);
      });
  });

  it("try to start another tech-build-order", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, techID: "101" })
      .then(res => {
        expect(res.body.error).equals("Planet already has a build-job");
        expect(res.status).equals(Globals.StatusCodes.BAD_REQUEST);
      });
  });

  it("try to start a tech-build-order while research-lab is upgrading", async () => {
    const planetID = 167546850;

    const planetBackup: Planet = await container.planetService.getPlanet(1, planetID, true);
    const planet: Planet = await container.planetService.getPlanet(1, planetID, true);

    planet.bBuildingId = Globals.Buildings.RESEARCH_LAB;
    planet.bBuildingEndTime = 1;

    await container.planetService.updatePlanet(planet);

    return request
      .post("/v1/techs/build")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, techID: "101" })
      .then(async res => {
        expect(res.body.error).equals("Planet is upgrading the research-lab");
        expect(res.status).equals(Globals.StatusCodes.BAD_REQUEST);

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
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.StatusCodes.BAD_REQUEST);
      });
  });

  it("cancel the tech-build-order", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/cancel")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, techID: "101" })
      .then(res => {
        expect(res.status).to.equals(Globals.StatusCodes.SUCCESS);
        expect(res.body.planetID).to.equals(planetID);
      });
  });

  it("should fail (user does not own the planet)", () => {
    const planetID = 1234;

    return request
      .post("/v1/techs/cancel")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, techID: "1101" })
      .then(res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).to.equals(Globals.StatusCodes.BAD_REQUEST);
      });
  });

  it("try cancel the build-order again", () => {
    const planetID = 167546850;

    return request
      .post("/v1/techs/cancel")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, techID: "1" })
      .then(res => {
        expect(res.body.error).equals("Planet has no build-job");
        expect(res.status).to.equals(Globals.StatusCodes.BAD_REQUEST);
      });
  });
});
