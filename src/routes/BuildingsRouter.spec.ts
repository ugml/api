import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";
import Planet from "../units/Planet";
import User from "../units/User";

const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App(container).express;

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("buildingsRoute", () => {
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

  describe("get list of buildings", () => {
    it("should return a list of buildings", () => {
      const planetID = 167546850;

      return request
        .get(`/v1/buildings/${planetID}`)
        .set("Authorization", authToken)
        .then(res => {
          expect(res.body.planetID).equals(planetID);
          expect(res.status).to.equals(Globals.Statuscode.SUCCESS);
        });
    });

    it("should return an empty list", () => {
      return request
        .get("/v1/buildings/1")
        .set("Authorization", authToken)
        .then(res => {
          expect(res.status).to.equals(Globals.Statuscode.SUCCESS);
          expect(res.body).to.be.equals(null);
        });
    });

    it("should fail (invalid building-id parameter)", () => {
      return request
        .get("/v1/buildings/test")
        .set("Authorization", authToken)
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });
  });

  describe("build and cancel buildings", () => {
    it("build-order should fail (missing buildingID-parameter)", () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    it("build-order should fail (missing planetID-parameter)", () => {
      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ buildingID: 1 })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    it("build-order should fail (buildingID is negative)", () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID, buildingID: -1 })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    it("build-order should fail (buildingID is higher than global maximum)", () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID, buildingID: 100 })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    it("build-order should fail (player does not own planet)", () => {
      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID: 1234, buildingID: 1 })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    // TODO: check, if ressources are correctly subtracted/added after build-request and cancelation
    describe("build-orders", () => {
      it("start a build-order", () => {
        const planetID = 167546850;

        return request
          .post("/v1/buildings/build")
          .set("Authorization", authToken)
          .send({ planetID, buildingID: 1 })
          .then(res => {
            expect(res.status).to.equals(Globals.Statuscode.SUCCESS);
            expect(res.body.planetID).to.be.equals(planetID);
            // TODO
          });
      });

      it("try to start another build-order on the same planet", () => {
        const planetID = 167546850;

        return request
          .post("/v1/buildings/build")
          .set("Authorization", authToken)
          .send({ planetID: `${planetID}`, buildingID: "1" })
          .then(res => {
            expect(res.body.error).equals("Planet already has a build-job");
            expect(res.status).equals(Globals.Statuscode.SUCCESS);
          });
      });
      it("cancel the build-order", () => {
        const planetID = 167546850;

        return request
          .post("/v1/buildings/cancel")
          .set("Authorization", authToken)
          .send({ planetID: `${planetID}`, buildingID: "1" })
          .then(res => {
            // TODO
            expect(res.status).to.equals(Globals.Statuscode.SUCCESS);
            expect(res.body.planetID).to.be.equals(planetID);
          });
      });
      it("try cancel the build-order again", () => {
        const planetID = 167546850;

        return request
          .post("/v1/buildings/cancel")
          .set("Authorization", authToken)
          .send({ planetID: `${planetID}`, buildingID: "1" })
          .then(res => {
            expect(res.body.error).equals("Planet has no build-job");
            expect(res.status).to.equals(Globals.Statuscode.SUCCESS);
          });
      });
    });

    it("should fail (missing buildingID-parameter)", () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    it("should fail (missing planetID-parameter)", () => {
      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ buildingID: 1 })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    it("should fail (buildingID is negative)", () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID, buildingID: -1 })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    it("should fail (buildingID is higher than global maximum)", () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID, buildingID: 100 })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    it("should fail (player does not own planet)", () => {
      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID: 1234, buildingID: 1 })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    it("should fail (player does not own the planet)", () => {
      const planetID = 12;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID, buildingID: 1 })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    it("start a build-order", () => {
      const planetID = 167546850;
      const buildingID = 1;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID, buildingID })
        .then(res => {
          expect(res.body.planetID).equals(planetID);
          expect(res.body.b_building_id).equals(buildingID);
          expect(res.status).to.equals(Globals.Statuscode.SUCCESS);
        });
    });

    it("try to start another build-order on the same planet", () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: "1" })
        .then(res => {
          expect(res.body.error).equals("Planet already has a build-job");
          expect(res.status).equals(Globals.Statuscode.SUCCESS);
        });
    });

    it("should fail (invalid planetID)", () => {
      const planetID = "test";

      return request
        .post("/v1/buildings/cancel")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: "1" })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    it("cancel the build-order", () => {
      const planetID = 167546850;
      const buildingID = 1;

      return request
        .post("/v1/buildings/cancel")
        .set("Authorization", authToken)
        .send({ planetID, buildingID })
        .then(res => {
          expect(res.body.planetID).to.be.equals(planetID);
          expect(res.body.b_building_id).to.be.equals(0);
          expect(res.body.b_building_endtime).to.be.equals(0);
          expect(res.status).to.equals(Globals.Statuscode.SUCCESS);
        });
    });

    it("try cancel the build-order again", () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/cancel")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: "1" })
        .then(res => {
          expect(res.body.error).equals("Planet has no build-job");
          expect(res.status).to.equals(Globals.Statuscode.SUCCESS);
        });
    });

    it("cancel should fail (player does not own the planet)", () => {
      const planetID = 1234;

      return request
        .post("/v1/buildings/cancel")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: "1" })
        .then(res => {
          expect(res.body.error).equals("Invalid parameter");
          expect(res.status).to.equals(Globals.Statuscode.BAD_REQUEST);
        });
    });

    it("should fail (can't build shipyard/robotic/nanite while it is being used)", async () => {
      const planetID = 167546850;

      const planet: Planet = await container.planetService.getPlanet(1, planetID, true);

      const valueBefore = planet.b_hangar_start_time;

      planet.b_hangar_queue = "[ { test: 1234 } ]";
      planet.b_hangar_start_time = 1;

      await container.planetService.updatePlanet(planet);

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: Globals.Buildings.ROBOTIC_FACTORY })
        .then(async res => {
          expect(res.body.error).equals("Can't build this building while it is in use");
          expect(res.status).equals(Globals.Statuscode.SUCCESS);

          // reset planet
          planet.b_hangar_start_time = valueBefore;
          await container.planetService.updatePlanet(planet);
        });
    });

    it("should fail (can't build research-lab while it is being used)", async () => {
      const planetID = 167546850;

      const planet: Planet = await container.planetService.getPlanet(1, planetID, true);
      const user: User = await container.userService.getAuthenticatedUser(planet.ownerID);

      const techIDold = user.b_tech_id;
      const endtime = user.b_tech_endtime;

      user.b_tech_endtime = 1;
      user.b_tech_id = 109;

      await container.userService.updateUserData(user);

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: Globals.Buildings.RESEARCH_LAB })
        .then(async res => {
          expect(res.body.error).to.be.equal("Can't build this building while it is in use");
          expect(res.status).equals(Globals.Statuscode.SUCCESS);

          user.b_tech_endtime = techIDold;
          user.b_tech_id = endtime;

          await container.userService.updateUserData(user);
        });
    });

    it("should fail (requirements are not met)", async () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: Globals.Buildings.TERRAFORMER })
        .then(async res => {
          expect(res.body.error).equals("Requirements are not met");
          expect(res.status).equals(Globals.Statuscode.SUCCESS);
        });
    });

    it("should fail (planet has not enough resources)", async () => {
      const planetID = 167546850;

      const planet: Planet = await container.planetService.getPlanet(1, planetID, true);

      const metalBefore = planet.metal;

      planet.metal = 0;

      await container.planetService.updatePlanet(planet);

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: Globals.Buildings.METAL_MINE })
        .then(async res => {
          expect(res.body.error).equals("Not enough resources");
          expect(res.status).equals(Globals.Statuscode.SUCCESS);

          // reset planet
          planet.metal = metalBefore;
          await container.planetService.updatePlanet(planet);
        });
    });
  });

  it("should fail (missing planetID)", async () => {
    return request
      .post("/v1/buildings/demolish")
      .set("Authorization", authToken)
      .send({ buildingID: Globals.Buildings.METAL_MINE })
      .then(async res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).equals(Globals.Statuscode.BAD_REQUEST);
      });
  });

  it("should fail (missing buildingID)", async () => {
    const planetID = 167546850;

    return request
      .post("/v1/buildings/demolish")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}` })
      .then(async res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).equals(Globals.Statuscode.BAD_REQUEST);
      });
  });

  it("should fail (nothing sent)", async () => {
    return request
      .post("/v1/buildings/demolish")
      .set("Authorization", authToken)
      .then(async res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).equals(Globals.Statuscode.BAD_REQUEST);
      });
  });

  it("should fail (invalid buildingID)", async () => {
    const planetID = 167546850;

    return request
      .post("/v1/buildings/demolish")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, buildingID: 503 })
      .then(async res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).equals(Globals.Statuscode.BAD_REQUEST);
      });
  });

  it("should fail (player does not own planet)", async () => {
    const planetID = 1234;

    return request
      .post("/v1/buildings/demolish")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, buildingID: Globals.Buildings.METAL_MINE })
      .then(async res => {
        expect(res.body.error).equals("Invalid parameter");
        expect(res.status).equals(Globals.Statuscode.BAD_REQUEST);
      });
  });

  it("should fail (building has level 0 and can't be demolished)", async () => {
    const planetID = 167546850;

    return request
      .post("/v1/buildings/demolish")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, buildingID: Globals.Buildings.MISSILE_SILO })
      .then(async res => {
        expect(res.body.error).equals("This building can't be demolished");
        expect(res.status).equals(Globals.Statuscode.BAD_REQUEST);
      });
  });

  it("should start demolition of a building", async () => {
    const planetID = 167546850;

    const planet: Planet = await container.planetService.getPlanet(1, planetID, true);

    return request
      .post("/v1/buildings/demolish")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, buildingID: Globals.Buildings.METAL_MINE })
      .then(async res => {
        expect(res.body.planetID).equals(planetID);
        expect(res.body.b_building_id).greaterThan(0);
        expect(res.body.b_building_endtime).greaterThan(0);
        expect(res.body.b_building_demolition).equals(true);
        expect(res.status).equals(Globals.Statuscode.SUCCESS);

        // reset
        await container.planetService.updatePlanet(planet);
      });
  });

  it("should fail (planet has already a build job)", async () => {
    const planetID = 167546850;

    const planet: Planet = await container.planetService.getPlanet(1, planetID, true);

    planet.b_building_id = 1;
    planet.b_building_endtime = 1234;
    planet.b_building_demolition = true;

    await container.planetService.updatePlanet(planet);

    return request
      .post("/v1/buildings/demolish")
      .set("Authorization", authToken)
      .send({ planetID: `${planetID}`, buildingID: Globals.Buildings.METAL_MINE })
      .then(async res => {
        expect(res.body.error).equals("Planet already has a build-job");
        expect(res.status).equals(Globals.Statuscode.BAD_REQUEST);

        // reset
        planet.b_building_id = 0;
        planet.b_building_endtime = 0;
        planet.b_building_demolition = false;
        await container.planetService.updatePlanet(planet);
      });
  });
});
