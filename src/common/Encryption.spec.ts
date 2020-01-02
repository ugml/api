import * as chai from "chai";
import Encryption from "./Encryption";

const PW = "arealpassword";
const NOT_PW = "nottherealpassword";

const expect = chai.expect;

describe("Encryption, a simple bcrypt wrapper", function() {
  it("hashes", async () => {
    const hash = await Encryption.hash(PW);
    // start of the hash encodes format
    expect(hash.slice(0, 7)).oneOf(["$2a$10$", "$2b$10$", "$2y$10$"]);
  });

  it("compare against hashes (different)", async () => {
    const hash = await Encryption.hash(PW);
    const result = await Encryption.compare(NOT_PW, hash);

    expect(result).to.equal(false);
  });

  it("compare against hashes (equal)", async () => {
    const hash = await Encryption.hash(PW);
    const result = await Encryption.compare(PW, hash);

    expect(result).to.equal(true);
  });
});
