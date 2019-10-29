const redis = require("redis"); // typescript throws errors if do es6 import
import dotenv = require("dotenv-safe");

dotenv.config({
  example: ".env.example",
});

/**
 * Manages the connection to the redis-database
 */
export default class Redis {
  private static client = redis.createClient(process.env.REDIS_PORT || 6379, process.env.REDIS_HOST || "localhost");
  /**
   * Returns the connection-object to the redis-instance
   */
  public static getConnection() {
    return Redis.client;
  }
}
