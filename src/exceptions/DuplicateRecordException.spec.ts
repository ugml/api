import * as chai from "chai";
import { DuplicateRecordException } from "./DuplicateRecordException";

const expect = chai.expect;

describe("DuplicateRecordException", function() {
  it("Create object", function() {
    try {
      throw new DuplicateRecordException("test");
    } catch (error) {
      const expected = new DuplicateRecordException("test");

      expect(typeof error).to.be.equals(typeof expected);
      expect(error.message).to.be.equals(expected.message);
    }
  });
});
