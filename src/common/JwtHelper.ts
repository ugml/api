const jwt = require("jsonwebtoken");

class JwtHelper {

    public generateToken(userID: number): string {
        return jwt.sign({
            userID,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30m",
        });
    }

    public validateToken(authString: string): string {

        if (authString !== undefined) {
            if (authString.startsWith("Bearer ")) {

                const token: string = authString.split(" ")[1];

                return jwt.verify(token, process.env.JWT_SECRET, function(error: any, decoded: any) {
                    return decoded;
                });
            }
        }

        return "";
    }
}


export { JwtHelper };
