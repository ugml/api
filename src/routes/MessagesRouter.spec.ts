import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";
import SimpleLogger from "../loggers/SimpleLogger";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App(container, new SimpleLogger()).express;

chai.use(chaiHttp);
const expect = chai.expect;

let authToken = "";
let request = chai.request(app);

describe("messagesRouter", () => {
  before(() => {
    return request
      .post("/v1/auth/login")
      .send({ email: "user_1501005189510@test.com", password: "admin" })
      .then(res => {
        authToken = res.body.token;
      });
  });

  beforeEach(function() {
    request = chai.request(app);
    return;
  });

  it("should return a list of messages", () => {
    return request
      .get("/v1/messages/get")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body[0].messageID).to.be.equals(5);
        expect(res.body[0].senderID).to.be.equals(1);
        expect(res.body[0].receiverID).to.be.equals(1);
        expect(res.body[0].type).to.be.equals(1);
        expect(res.body[0].subject).to.be.equals("test");
        expect(res.body[0].body).to.be.equals("asdf");
      });
  });

  it("should return a specific message", () => {
    return request
      .get("/v1/messages/get/5")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.messageID).to.be.equals(5);
        expect(res.body.senderID).to.be.equals(1);
        expect(res.body.receiverID).to.be.equals(1);
        expect(res.body.type).to.be.equals(1);
        expect(res.body.subject).to.be.equals("test");
        expect(res.body.body).to.be.equals("asdf");
      });
  });

  it("should fail (invalid message-id)", () => {
    return request
      .get("/v1/messages/get/asdf")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should return nothing (message does not exist)", () => {
    return request
      .get("/v1/messages/get/-1")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body).to.be.empty;
      });
  });

  it("should send a message", () => {
    return request
      .post("/v1/messages/send")
      .send({ receiverID: 48, subject: "Test", body: "Test" })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body).to.be.empty;
      });
  });

  it("should fail (receiverID not set)", () => {
    return request
      .post("/v1/messages/send")
      .send({ subject: "Test", body: "Test" })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (subject not set)", () => {
    return request
      .post("/v1/messages/send")
      .send({ receiverID: 1, body: "Test" })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (body not set)", () => {
    return request
      .post("/v1/messages/send")
      .send({ receiverID: 1, subject: "Test" })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (receiver does not exist)", () => {
    return request
      .post("/v1/messages/send")
      .send({ receiverID: 91283917239, subject: "Test", body: "Test" })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("The receiver does not exist");
      });
  });

  it("should delete a message", () => {
    return request
      .post("/v1/messages/delete")
      .send({ messageID: 5 })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body).to.be.empty;
      });
  });

  it("should fail (message-id not set)", () => {
    return request
      .post("/v1/messages/delete")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });

  it("should fail (invalid message-id)", () => {
    return request
      .post("/v1/messages/delete")
      .set("Authorization", authToken)
      .send({ messageID: "asdf" })
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.error).to.be.equals("Invalid parameter");
      });
  });
});
