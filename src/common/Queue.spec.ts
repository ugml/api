import * as chai from "chai";
import Queue from "./Queue";
import QueueItem from "./QueueItem";

const assert = chai.assert;
const expect = chai.expect;

describe("Queue", function() {
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

    assert.equal(queue.getQueue().length, 0);

    queue.getQueue().push(new QueueItem(201, 1));

    assert.equal(queue.getQueue().length, 1);
    assert.equal(queue.getQueue()[0].unitID, 201);
    assert.equal(queue.getQueue()[0].amount, 1);
  });

  it("Queue should be empty", function() {
    const queue: Queue = new Queue();
    expect(queue.getQueue()).to.be.eql([]);
  });
});
