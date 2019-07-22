const redis = require("redis"); // typescript throws errors if do es6 import
const client = redis.createClient(process.env.REDIS_PORT || 6379, process.env.REDIS_HOST || "localhost");

/**
 * Manages the connection to the redis-database
 */
export default class Redis {
  /**
   * Returns the connection-object to the redis-instance
   */
  public static getConnection() {
    return client;
  }
}
