import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";

const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App(container).express;

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("eventRouter", () => {
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

  it("should create a new event", () => {
    const eventData = `{
    "ownerID": 1,
    "mission": "attack",
    "speed": 30,
    "holdDuration": 695,
    "data": {
        "origin": {
            "pos_galaxy": 9,
            "pos_system": 54,
            "pos_planet": 1,
            "type": "planet"
        },
        "destination": {
            "pos_galaxy": 4,
            "pos_system": 71,
            "pos_planet": 2,
            "type": "planet"
        },
        "ships": {
            "201": 612,
            "202": 357,
            "203": 617,
            "204": 800,
            "205": 709,
            "206": 204,
            "207": 703,
            "208": 85,
            "209": 631,
            "210": 388,
            "211": 0,
            "212": 723,
            "213": 557,
            "214": 106
        },
        "loadedRessources": {
            "metal": 443,
            "crystal": 980,
            "deuterium": 220
        }
    }
}`;

    return request
      .post("/v1/events/create")
      .send({ event: eventData })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.body.message).to.be.equals("Event successfully created");
      });
  });

  it("should fail (no data sent)", () => {
    return request
      .post("/v1/events/create")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.message).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (invalid json / missing attributes)", () => {
    const eventData = `{
    "ownerID": 1,
    "mission": "attack",
    "speed": 30,
    "holdDuration": 695,
    "data": {
        "origin": {
            "pos_galaxy": 9,
            "pos_system": 54,
            "pos_planet": 1,
            "type": "planet"
        },
        "destination": {
            "pos_galaxy": 4,
            "pos_system": 71,
            "pos_planet": 2,
            "type": "planet"
        }
    }
}`;

    return request
      .post("/v1/events/create")
      .send({ event: eventData })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.message).to.be.equals("Invalid json");
      });
  });

  it("should fail (user is not event-creator)", () => {
    const eventData = `{
    "ownerID": 3,
    "mission": "attack",
    "speed": 30,
    "holdDuration": 695,
    "data": {
        "origin": {
            "pos_galaxy": 9,
            "pos_system": 54,
            "pos_planet": 1,
            "type": "planet"
        },
        "destination": {
            "pos_galaxy": 4,
            "pos_system": 71,
            "pos_planet": 2,
            "type": "planet"
        },
        "ships": {
            "201": 612,
            "202": 357,
            "203": 617,
            "204": 800,
            "205": 709,
            "206": 204,
            "207": 703,
            "208": 85,
            "209": 631,
            "210": 388,
            "211": 0,
            "212": 723,
            "213": 557,
            "214": 106
        },
        "loadedRessources": {
            "metal": 443,
            "crystal": 980,
            "deuterium": 220
        }
    }
}`;

    return request
      .post("/v1/events/create")
      .send({ event: eventData })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.message).to.be.equals("Event-creator is not currently authenticated user");
      });
  });

  it("should fail (missiontype not yet supported)", () => {
    const eventData = `{
    "ownerID": 1,
    "mission": "acs",
    "speed": 30,
    "holdDuration": 695,
    "data": {
        "origin": {
            "pos_galaxy": 9,
            "pos_system": 54,
            "pos_planet": 1,
            "type": "planet"
        },
        "destination": {
            "pos_galaxy": 4,
            "pos_system": 71,
            "pos_planet": 2,
            "type": "planet"
        },
        "ships": {
            "201": 612,
            "202": 357,
            "203": 617,
            "204": 800,
            "205": 709,
            "206": 204,
            "207": 703,
            "208": 85,
            "209": 631,
            "210": 388,
            "211": 0,
            "212": 723,
            "213": 557,
            "214": 106
        },
        "loadedRessources": {
            "metal": 443,
            "crystal": 980,
            "deuterium": 220
        }
    }
}`;

    return request
      .post("/v1/events/create")
      .send({ event: eventData })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.message).to.be.equals("Missiontype not yet supported");
      });
  });

  it("should fail (player does not own startplanet)", () => {
    const eventData = `{
    "ownerID": 1,
    "mission": "transport",
    "speed": 30,
    "holdDuration": 695,
    "data": {
        "origin": {
            "pos_galaxy": 6,
            "pos_system": 46,
            "pos_planet": 7,
            "type": "planet"
        },
        "destination": {
            "pos_galaxy": 4,
            "pos_system": 71,
            "pos_planet": 2,
            "type": "planet"
        },
        "ships": {
            "201": 612,
            "202": 357,
            "203": 617,
            "204": 800,
            "205": 709,
            "206": 204,
            "207": 703,
            "208": 85,
            "209": 631,
            "210": 388,
            "211": 0,
            "212": 723,
            "213": 557,
            "214": 106
        },
        "loadedRessources": {
            "metal": 443,
            "crystal": 980,
            "deuterium": 220
        }
    }
}`;

    return request
      .post("/v1/events/create")
      .send({ event: eventData })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.message).to.be.equals("Origin does not exist or user is not the owner");
      });
  });

  it("should fail (destination does not exist)", () => {
    const eventData = `{
    "ownerID": 1,
    "mission": "transport",
    "speed": 30,
    "holdDuration": 695,
    "data": {
        "origin": {
            "pos_galaxy": 9,
            "pos_system": 54,
            "pos_planet": 1,
            "type": "planet"
        },
        "destination": {
            "pos_galaxy": 1,
            "pos_system": 1,
            "pos_planet": 1,
            "type": "planet"
        },
        "ships": {
            "201": 612,
            "202": 357,
            "203": 617,
            "204": 800,
            "205": 709,
            "206": 204,
            "207": 703,
            "208": 85,
            "209": 631,
            "210": 388,
            "211": 0,
            "212": 723,
            "213": 557,
            "214": 106
        },
        "loadedRessources": {
            "metal": 443,
            "crystal": 980,
            "deuterium": 220
        }
    }
}`;

    return request
      .post("/v1/events/create")
      .send({ event: eventData })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.body.message).to.be.equals("Destination does not exist");
      });
  });

  it("should cancel an event", () => {
    return request
      .post("/v1/events/cancel")
      .send({ eventID: 1 })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.message).to.be.equals("Event successfully canceled");
        expect(res.body.status).to.be.equals(Globals.Statuscode.SUCCESS);
      });
  });

  it("should fail (no parameter sent)", () => {
    return request
      .post("/v1/events/cancel")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.message).to.be.equals("Invalid parameter");
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
      });
  });

  it("should fail (invalid parameter sent)", () => {
    return request
      .post("/v1/events/cancel")
      .set("Authorization", authToken)
      .send({ eventID: "asdf" })
      .then(res => {
        expect(res.body.message).to.be.equals("Invalid parameter");
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
      });
  });

  it("should fail (event does not exist)", () => {
    return request
      .post("/v1/events/cancel")
      .set("Authorization", authToken)
      .send({ eventID: 33580 })
      .then(res => {
        expect(res.body.message).to.be.equals("The event does not exist or can't be canceled");
        expect(res.body.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
      });
  });

  // TODO: check, if event is in redis
  // TODO: check, if event really is returning
});
