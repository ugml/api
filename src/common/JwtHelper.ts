const jwt = require('jsonwebtoken');

class JwtHelper {

    generateToken(userID : number) : string {
        return jwt.sign({
                userID: userID
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30m'
            });
    }

    validateToken(authString : string) : string {

        if(authString !== undefined) {
            if(authString.startsWith("Bearer ")) {

                const token = authString.split(" ")[1];

                return jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
                    return decoded;
                });
            }
        }

        return "";
    }
}


export { JwtHelper }
