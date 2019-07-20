import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";

const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App(container).express;

chai.use(chaiHttp);
const expect = chai.expect;

describe("configRoute", () => {
  let request = chai.request(app);

  beforeEach(function() {
    request = chai.request(app);
  });

  it("should return the units-config", () => {
    const data = require("../config/units.json");

    return request.get("/v1/config/units").then(res => {
      expect(res.type).to.eql("application/json");
      expect(res.body).to.eql(data);
    });
  });

  it("should return the game-config", () => {
    const data = require("../config/game.json");

    return request.get("/v1/config/game").then(res => {
      expect(res.type).to.eql("application/json");
      expect(res.body).to.eql(data);
    });
  });
});
