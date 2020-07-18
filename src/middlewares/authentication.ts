import * as express from "express";
import * as jwt from "jsonwebtoken";

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
  if (securityName === "JWT" || securityName === "jwt") {
    let token: string = (request.headers["access-token"] as string) || (request.headers.authorization as string);

    if (token.startsWith("Bearer")) {
      token = token.replace("Bearer ", "");
    }

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error("No token provided"));
      }
      jwt.verify(token, process.env.JWT_SECRET, function(err: any, decoded: any) {
        if (err) {
          reject(err);
        } else {
          // Check if JWT contains all required scopes
          for (const scope of scopes) {
            if (!decoded.scopes.includes(scope)) {
              reject(new Error("JWT does not contain required scope."));
            }
          }
          resolve(decoded);
        }
      });
    });
  }
}
