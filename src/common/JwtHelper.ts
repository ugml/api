import { IJwt } from "../interfaces/IJwt";

const jwt = require("jsonwebtoken");

class JwtHelper {
  public static generateToken(userID: number): string {
    return jwt.sign(
      {
        userID,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      },
    );
  }

  public static validateToken(token: string): IJwt {
    if (token !== undefined) {
      return jwt.verify(token, process.env.JWT_SECRET, function(error: any, decoded: any) {
        return decoded;
      });
    }
  }
}

export { JwtHelper };
