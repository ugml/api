import * as mocha from "mocha";
import * as chai from "chai";
import { QueueItem } from "./QueueItem";

var assert = chai.assert;

describe("QueueItem", function() {
  it("PlanetID should be -1", function() {
    const item: QueueItem = new QueueItem();

    assert.equal(item.getPlanetID(), -1);
  });
});
