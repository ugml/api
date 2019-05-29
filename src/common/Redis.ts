const redis = require("redis"); // typescript throws errors if do es6 import
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

class Redis {

    static getConnection() {
        return client;
    }

}

export { Redis };
