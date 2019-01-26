const Sequelize = require('sequelize'); // typescript throws errors if do es6 import
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

class DB {

    getConnection() {
        return sequelize;
    }


}

export { DB };
