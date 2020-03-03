const SALT_WORK_FACTOR = 10;
const crypto = require("crypto");

let bcrypt;
try {
  bcrypt = require("bcrypt");
} catch (e) {
  // tslint:disable-next-line: no-console
  console.warn("Warning: Falling back to bcryptjs");
  bcrypt = require("bcryptjs");
}

/**
 * This class contains functionality to hash passwords and check them
 */
export default class Encryption {
  /**
   * Generates password hash
   * @param password to hash
   */
  public static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_WORK_FACTOR);
  }

  /**
   * Compare password and hash
   */
  public static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generates a random token
   * @param byteLength the length of the generated token
   */
  public static async generateToken(byteLength = 128): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(byteLength, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer.toString("base64"));
        }
      });
    });
  }
}
