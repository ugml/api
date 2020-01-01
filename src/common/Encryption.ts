const SALT_WORK_FACTOR = 10;
let bcrypt;
try {
  bcrypt = require("bcrypt");
} catch (e) {
  console.log("Warning falling back to bcryptjs");
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
}
