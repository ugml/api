import * as chai from "chai";
import Database from "./Database";

import chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect;

describe("Database", function() {
  it("Connect and query", async function() {
    const [rows] = await Database.query("SELECT 1 AS test;");

    expect(rows[0].test).to.be.equals(1);
  });

  it("Get connection", function() {
    expect(Database.getConnectionPool()).not.to.be.equals(null);
  });
});
