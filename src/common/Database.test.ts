import * as mocha from "mocha";
import * as chai from "chai";
import { Config } from "./Config";
import { Database } from "./Database";

import chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

let expect = chai.expect;

describe("Database", function() {
  it("Connect and query", async function() {
    let result = await Database.query("SELECT 1 AS result;");

    expect(result[0]).to.have.property("result");
  });

  it("Get connection", function() {
    expect(Database.getConnection()).not.to.be.null;
  });
});
