const redis = require("redis"); // typescript throws errors if do es6 import
import dotenv = require("dotenv-safe");

dotenv.config({
  example: ".env.example",
  allowEmptyValues: true,
});

/**
 * Manages the connection to the redis-database
 */
export default class Redis {
  private static client = redis.createClient({
    port: process.env.REDIS_PORT || 6379, // replace with your port
    host: process.env.REDIS_HOST || "localhost", // replace with your hostanme or IP address
    password: process.env.REDIS_PASSWORD || "", // replace with your password
  });
  /**
   * Returns the connection-object to the redis-instance
   */
  public static getConnection() {
    return Redis.client;
  }
}
