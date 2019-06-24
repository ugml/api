import * as mocha from "mocha";
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
    let planetID = 167546850;

    return request
      .get(`/v1/buildings/${planetID}`)
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.data[0].planetID).equals(planetID);
      });
  });

  // TODO: check, if ressources are correctly subtracted/added after build-request and cancelation
  describe("build and cancel a build-order", () => {
    it("start a build-order", () => {
      let planetID = 167546850;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID: planetID, buildingID: 1 })
        .then(res => {
          expect(res.body.message).equals("Job started");
        });
    });

    it("try to start another build-order on the same planet", () => {
      let planetID = 167546850;

      return request
        .post("/v1/buildings/build")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: "1" })
        .then(res => {
          expect(res.body.message).equals("Planet already has a build-job");
        });
    });
    it("cancel the build-order", () => {
      let planetID = 167546850;

      return request
        .post("/v1/buildings/cancel")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: "1" })
        .then(res => {
          expect(res.body.message).equals("Building canceled");
        });
    });
    it("try cancel the build-order again", () => {
      let planetID = 167546850;

      return request
        .post("/v1/buildings/cancel")
        .set("Authorization", authToken)
        .send({ planetID: `${planetID}`, buildingID: "1" })
        .then(res => {
          expect(res.body.message).equals("Planet has no build-job");
        });
    });
  });
});
