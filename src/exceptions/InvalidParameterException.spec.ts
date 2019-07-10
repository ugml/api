import * as chai from "chai";
import { InvalidParameterException } from "./InvalidParameterException";

const expect = chai.expect;

describe("DuplicateRecordException", function() {
  it("Create object", function() {
    try {
      throw new InvalidParameterException("test");
    } catch (error) {
      let expected = new InvalidParameterException("test");

      expect(typeof error).to.be.equals(typeof expected);
      expect(error.message).to.be.equals(expected.message);
    }
  });
});
