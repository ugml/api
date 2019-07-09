import mysql = require("mysql2/promise");
import { Logger } from "./Logger";

import dotenv = require("dotenv-safe");

dotenv.config({
  example: process.env.CI ? ".env.ci.example" : ".env.example",
});

/***
 * Manages the connection to the (mysql/mariaDB)-database
 */
class Database {
  /***
   * Returns the current connection to the mysql-database
   */
  public static getConnectionPool() {
    return this.pool;
  }

  /***
   * Returns a promise for a query
   * @param sql
   * @param args
   */
  public static query(sql: string, args: object = null): Promise<any> {
    Logger.info(sql);
    return this.pool.query(sql);
  }

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
      Logger.error(err);
    });
}

export { Database };
