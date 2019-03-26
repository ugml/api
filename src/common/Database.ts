const mysql = require('mysql2');

class Database {

    private static connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS
    });

    public static getConnection() {
        return this.connection;
    }

}

export { Database };
