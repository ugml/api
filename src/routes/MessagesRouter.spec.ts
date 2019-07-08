import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../App";

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
        authToken = res.body.data.token;
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
        expect(res.body.status).to.be.equals(200);
        expect(res.type).to.eql("application/json");
      });
  });

  it("should return a specific message", () => {
    return request
      .get("/v1/messages/get/5")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(200);
        expect(res.type).to.eql("application/json");
        expect(res.body.data).not.to.be.empty;
      });
  });

  it("should return nothing (message does not exist)", () => {
    return request
      .get("/v1/messages/get/-1")
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(200);
        expect(res.type).to.eql("application/json");
        expect(res.body.data).to.be.empty;
      });
  });

  it("should send a message", () => {
    return request
      .post("/v1/messages/send")
      .send({ receiverID: 48, subject: "Test", body: "Test" })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(200);
        expect(res.type).to.eql("application/json");
        expect(res.body.message).to.be.equals("Message sent");
        expect(res.body.data).to.be.empty;
      });
  });

  it("should delete a message", () => {
    return request
      .post("/v1/messages/delete")
      .send({ messageID: 5 })
      .set("Authorization", authToken)
      .then(res => {
        expect(res.body.status).to.be.equals(200);
        expect(res.type).to.eql("application/json");
        expect(res.body.data).to.be.empty;
      });
  });
});
