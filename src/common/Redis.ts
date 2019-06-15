const redis = require("redis"); // typescript throws errors if do es6 import
const client = redis.createClient(process.env.REDIS_PORT || 6379, process.env.REDIS_HOST || "localhost");

class Redis {
  public static getConnection() {
    return client;
  }
}

export { Redis };
