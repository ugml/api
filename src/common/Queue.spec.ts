import * as chai from "chai";
import Queue from "./Queue";

const assert = chai.assert;
const expect = chai.expect;

describe("Queue", function() {
  it("PlanetID should be -1", function() {
    const queue: Queue = new Queue();

    assert.equal(queue.getPlanetID(), -1);
  });

  it("LastUpdateTime should be 0", function() {
    const queue: Queue = new Queue();

    assert.equal(queue.getLastUpdateTime(), 0);

    queue.setLastUpdateTime(10);

    assert.equal(queue.getLastUpdateTime(), 10);
  });

  it("TimeRemaining should be 0", function() {
    const queue: Queue = new Queue();

    assert.equal(queue.getTimeRemaining(), 0);

    queue.setTimeRemaining(20);

    assert.equal(queue.getTimeRemaining(), 20);
  });

  it("Should add value to queue", function() {
    const queue: Queue = new Queue();

    assert.equal(queue.getQueue().size, 0);

    queue.getQueue().set("testKey", 1);

    assert.equal(queue.getQueue().size, 1);
    assert.equal(queue.getQueue().get("testKey"), 1);
  });

  it("Queue should be empty", function() {
    const queue: Queue = new Queue();
    /* eslint-disable no-unused-expressions */
    expect(queue.getQueue()).to.be.eql({});
  });
});
