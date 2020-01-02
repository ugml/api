import IJwt from "../interfaces/IJwt";

const jwt = require("jsonwebtoken");

/**
 * This class contains functionality to generate and validate JWT-token
 */
export default class JwtHelper {
  /**
   * Generates a new JWT-token containing the passed userID
   * @param userID the userID of the authenticated user
   */
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
      return jwt.verify(token, process.env.JWT_SECRET, function(error: any, decoded: any) {
        return decoded;
      });
    }
  }
}
