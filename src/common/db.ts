const Sequelize = require('sequelize'); // typescript throws errors if do es6 import
// import * as dotenv from 'dotenv-webpack';

let mysql = require('mysql');


class DB {

    getConnection() {
        return mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
    }
}

export { DB };
