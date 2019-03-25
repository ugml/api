const Sequelize = require('sequelize'); // typescript throws errors if do es6 import
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    // logging: false,

    logging: function (str : string) {
        // TODO: logging through a logger-object and store in logfiles
        if(!str.includes("password"))
            console.log(str);
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

class Database {

    static getConnection() {
        return sequelize;
    }

}

export { Database };
