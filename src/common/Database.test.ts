import * as mocha from "mocha";
import * as chai from "chai";
import { Config } from "./Config";
import { Database } from "./Database";

import chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

let expect = chai.expect;

describe("Database", function() {
  it("Connect and query", async function() {
    let result = await Database.query("SELECT 1 AS test;");

    expect(result[0][0].test).to.be.equals(1);
  });

  it("Get connection", function() {
    expect(Database.getConnectionPool()).not.to.be.null;
  });
});
