import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import Config from "../common/Config";

const app = new App().express;

chai.use(chaiHttp);
const expect = chai.expect;

describe("configRoute", () => {
  let request = chai.request(app);

  beforeEach(function() {
    request = chai.request(app);
  });

  it("should return the units-config", () => {
    const data = Config.getGameConfig();

    return request.get("/v1/config/units").then(res => {
      expect(res.type).to.eql("application/json");
      expect(res.body).to.eql(data.units);
    });
  });

  it("should return the game-config", () => {
    const data = Config.getGameConfig();

    return request.get("/v1/config/game").then(res => {
      expect(res.type).to.eql("application/json");
      expect(res.body).to.eql(data);
    });
  });
});
