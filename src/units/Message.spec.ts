import * as chai from "chai";
import { SerializationHelper } from "../common/SerializationHelper";
import Buildings from "./Buildings";
import Defenses from "./Defenses";
import Message from "./Message";

const assert = chai.assert;

describe("Message-unit", function() {
  it("message should be valid", function() {
    const data = {
      messageID: 1,
      senderID: 1,
      receiverID: 2,
      sendtime: 1,
      type: 1,
      subject: "ThisIsATest",
      body: "ThisIsATest",
      deleted: false,
    };

    let message: Message = SerializationHelper.toInstance(new Message(), JSON.stringify(data));

    assert.equal(message.isValid(), true);
  });

  it("Should fail (negative ID)", function() {
    const data = {
      messageID: 1,
      senderID: -1,
      receiverID: 2,
      sendtime: 1,
      type: 1,
      subject: "ThisIsATest",
      body: "ThisIsATest",
      deleted: false,
    };

    let message: Message = SerializationHelper.toInstance(new Message(), JSON.stringify(data));

    assert.equal(message.isValid(), false);
  });

  it("Should fail (missing value)", function() {
    const data = {
      messageID: 1,
      senderID: 1,
      sendtime: 1,
      type: 1,
      subject: "ThisIsATest",
      body: "ThisIsATest",
      deleted: false,
    };

    let message: Message = SerializationHelper.toInstance(new Message(), JSON.stringify(data));

    assert.equal(message.isValid(), false);
  });

  it("Should fail (subject too short)", function() {
    const data = {
      messageID: 1,
      senderID: 1,
      receiverID: 2,
      sendtime: 1,
      type: 1,
      subject: "",
      body: "ThisIsATest",
      deleted: false,
    };

    let message: Message = SerializationHelper.toInstance(new Message(), JSON.stringify(data));

    assert.equal(message.isValid(), false);
  });

  it("Should fail (sender = receiver)", function() {
    const data = {
      messageID: 1,
      senderID: 1,
      receiverID: 1,
      sendtime: 1,
      type: 1,
      subject: "ThisIsATest",
      body: "ThisIsATest",
      deleted: false,
    };

    let message: Message = SerializationHelper.toInstance(new Message(), JSON.stringify(data));

    assert.equal(message.isValid(), false);
  });
});
