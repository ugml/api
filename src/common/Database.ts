import mysql = require("mysql2/promise");
import RequestLogger from "./RequestLogger";
import dotenv = require("dotenv");

dotenv.config();

/**
 * Manages the connection to the (mysql/mariaDB)-database
 */
export default class Database {
  /**
   * Returns the connection-pool to the mysql-database
   */
  public static getConnectionPool() {
    return this.pool;
  }

  /**
   * Returns a promise for a query
   * @param sql the sql-query
   * @param args optional arguments
   */
  public static query(sql: string, args: object = null): Promise<any> {
    RequestLogger.info(sql);
    return this.pool.query(sql);
  }

  /**
   * Represents a mysql connection-pool
   */
  private static pool = mysql
    .createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      database: process.env.DB_NAME || "ugamela",
      password: process.env.DB_PASS || "",
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
    .on("error", function(err) {
      RequestLogger.error(err);
    });
}
