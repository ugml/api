const SALT_WORK_FACTOR = 10;
let bcrypt;
try {
  bcrypt = require("bcrypt");
} catch (e) {
  // tslint:disable-next-line: no-console
  console.warn("Warning: Falling back to bcryptjs");
  bcrypt = require("bcryptjs");
}

export default class Encryption {
  public static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_WORK_FACTOR);
  }

  public static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
