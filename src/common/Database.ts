const mysql = require('mysql2');

const Logger = require('./Logger');

class Database {

    private static connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT
    }).on('error', function(err) {
        Logger.error(err);
    });

    public static getConnection() {
        return this.connection;
    }

    public static query(sql, args = null) {
        Logger.info(sql);

        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
            }
        ).catch(err => {
            Logger.error(err);
            return Promise.reject(err);
        });
    }

}

export { Database };
