const redis = require("redis"); // typescript throws errors if do es6 import
import dotenv = require("dotenv");

dotenv.config();

/**
 * Manages the connection to the redis-database
 */
export default class Redis {
  /**
   * Returns the connection-object to the redis-instance
   */
  public static getClient() {
    return Redis.client;
  }
  private static client = redis.createClient({
    port: process.env.REDIS_PORT || 6379, // replace with your port
    host: process.env.REDIS_HOST || "localhost", // replace with your hostanme or IP address
    password: process.env.REDIS_PASSWORD || undefined, // replace with your password
  });
}
