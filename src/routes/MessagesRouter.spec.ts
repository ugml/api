import * as chai from "chai";
import chaiHttp = require("chai-http");

import App from "../App";
import { Globals } from "../common/Globals";
import Message from "../units/Message";

const createContainer = require("../ioc/createContainer");

const container = createContainer();

const app = new App(container).express;

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
        expect(res.body.data[0].messageID).to.be.equals(5);
        expect(res.body.data[0].senderID).to.be.equals(1);
        expect(res.body.data[0].receiverID).to.be.equals(1);
        expect(res.body.data[0].type).to.be.equals(1);
        expect(res.body.data[0].subject).to.be.equals("test");
        expect(res.body.data[0].body).to.be.equals("asdf");
      });
  });

  it("should return a specific message", () => {
    return request
      .get("/v1/messages/get/5")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.data.messageID).to.be.equals(5);
        expect(res.body.data.senderID).to.be.equals(1);
        expect(res.body.data.receiverID).to.be.equals(1);
        expect(res.body.data.type).to.be.equals(1);
        expect(res.body.data.subject).to.be.equals("test");
        expect(res.body.data.body).to.be.equals("asdf");
      });
  });

  it("should fail (invalid message-id)", () => {
    return request
      .get("/v1/messages/get/asdf")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.message).to.be.equals("Invalid parameter");
        expect(res.body.data).to.be.eql({});
      });
  });

  it("should return nothing (message does not exist)", () => {
    return request
      .get("/v1/messages/get/-1")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.SUCCESS);
        expect(res.type).to.eql("application/json");
        expect(res.body.data).to.be.eql({});
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
        expect(res.body.message).to.be.equals("Message sent");
        expect(res.body.data).to.be.eql({});
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
        expect(res.body.message).to.be.equals("Invalid parameter");
        expect(res.body.data).to.be.eql({});
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
        expect(res.body.message).to.be.equals("Invalid parameter");
        expect(res.body.data).to.be.eql({});
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
        expect(res.body.message).to.be.equals("Invalid parameter");
        expect(res.body.data).to.be.eql({});
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
        expect(res.body.message).to.be.equals("The receiver does not exist");
        expect(res.body.data).to.be.eql({});
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
        expect(res.body.data).to.be.eql({});
      });
  });

  it("should fail (message-id not set)", () => {
    return request
      .post("/v1/messages/delete")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.status).to.be.equals(Globals.Statuscode.BAD_REQUEST);
        expect(res.type).to.eql("application/json");
        expect(res.body.message).to.be.equals("Invalid parameter");
        expect(res.body.data).to.be.eql({});
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
        expect(res.body.message).to.be.equals("Invalid parameter");
        expect(res.body.data).to.be.eql({});
      });
  });
});
