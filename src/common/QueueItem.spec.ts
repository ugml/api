import * as mocha from "mocha";
import * as chai from "chai";
import Queue from "./Queue";

const assert = chai.assert;
const expect = chai.expect;

describe("Queue", function() {
  it("PlanetID should be -1", function() {
    const item: Queue = new Queue();

    assert.equal(item.getPlanetID(), -1);
  });

  it("LastUpdateTime should be 0", function() {
    const item: Queue = new Queue();

    assert.equal(item.getLastUpdateTime(), 0);
  });

  it("TimeRemaining should be 0", function() {
    const item: Queue = new Queue();

    assert.equal(item.getTimeRemaining(), 0);
  });

  it("Queue should be empty", function() {
    const item: Queue = new Queue();
    /* eslint-disable no-unused-expressions */
    expect(item.getQueue()).to.be.eql({});
  });
});
