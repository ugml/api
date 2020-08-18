import IJwt from "../interfaces/IJwt";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require("jsonwebtoken");

export default class JwtHelper {
  public static generateToken(userID: number): string {
    return jwt.sign(
      {
        userID,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
  }

  /**
   * Validates a given JWT-token.
   * Returns null, if the JWT-token is not valid.
   * @param token the JWT-token
   * @returns the decoded JWT-token if valid, otherwise null is returned
   */
  public static validateToken(token: string): IJwt {
    if (token !== undefined) {
      return jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
        return decoded;
      });
    }
  }
}
