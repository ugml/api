import mysql = require("mysql2/promise");
import dotenv = require("dotenv");

dotenv.config();

export default class Database {
  public static getConnectionPool() {
    return this.connectionPool;
  }

  public static query(sql: string) {
    // TODO: Log the mysql-errors
    return this.connectionPool.query(sql);
  }
  private static connectionPool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    database: process.env.DB_NAME || "ugamela",
    password: process.env.DB_PASS || "",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 40,
  });
}
