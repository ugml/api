import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("buildingsRoute", () => {
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

  it("should return a list of buildings", () => {
    const planetID = 167546850;

    return request
      .get(`/v1/buildings/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.data[0].planetID).equals(planetID);
        expect(res.status).to.eql(200);
      });
  });

  it("should fail (missing buildingID-parameter)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/buildings/build")
      .set("Authorization", authToken)
      .send({ planetID: planetID })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.eql(400);
      });
  });

  it("should fail (missing planetID-parameter)", () => {
    return request
      .post("/v1/buildings/build")
      .set("Authorization", authToken)
      .send({ buildingID: 1 })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.eql(400);
      });
  });

  it("should fail (buildingID is negative)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/buildings/build")
      .set("Authorization", authToken)
      .send({ planetID: planetID, buildingID: -1 })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.eql(400);
      });
  });

  it("should fail (buildingID is higher than global maximum)", () => {
    const planetID = 167546850;

    return request
      .post("/v1/buildings/build")
      .set("Authorization", authToken)
      .send({ planetID: planetID, buildingID: 100 })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.eql(400);
      });
  });

  it("should fail (player does not own planet)", () => {
    return request
      .post("/v1/buildings/build")
      .set("Authorization", authToken)
      .send({ planetID: 1234, buildingID: 1 })
      .then(res => {
        expect(res.body.message).equals("Invalid parameter");
        expect(res.status).to.eql(400);
      });
  });

  // TODO: check, if ressources are correctly subtracted/added after build-request and cancelation
  describe("build and cancel a build-order", () => {
    it("start a build-order", () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID: planetID, buildingID: 1 })
        .then(res => {
          expect(res.body.message).equals("Job started");
          expect(res.status).to.eql(200);
        });
    });

    it("try to start another build-order on the same planet", () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: "1" })
        .then(res => {
          expect(res.body.message).equals("Planet already has a build-job");
          expect(res.body.status).equals(200);
        });
    });
    it("cancel the build-order", () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/cancel")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: "1" })
        .then(res => {
          expect(res.body.message).equals("Building canceled");
          expect(res.status).to.eql(200);
        });
    });
    it("try cancel the build-order again", () => {
      const planetID = 167546850;

      return request
        .post("/v1/buildings/cancel")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: "1" })
        .then(res => {
          expect(res.body.message).equals("Planet has no build-job");
          expect(res.status).to.eql(200);
        });
    });
  });
});
