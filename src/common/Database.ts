import mysql = require("mysql2");
import winston = require("winston");

const Logger : winston.Logger = require("./Logger");

/***
 * Manages the connection to the (mysql/mariaDB)-database
 */
class Database {

    private static connection = mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        database: process.env.DB_NAME || "ugamela",
        password: process.env.DB_PASS || '',
        port: process.env.DB_PORT || 3306
    }).on('error', function(err) {
        Logger.error(err);
    });


    /***
     * Returns the current connection to the mysql-database
     */
    public static getConnection() : object {
        return this.connection;
    }

    /***
     * Returns a promise for a query
     * @param sql
     * @param args
     */
    public static query(sql : string, args : object = null) : Promise<object> {
        Logger.info(sql);

        return new Promise((resolve : any, reject : any) : any => {
            return this.connection.query(sql, args, (err : any, rows : any) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
            }
        ).catch((err : string) => {
            Logger.error(err);
            return Promise.reject(err);
        });
    }

}

export { Database };
