const mysql = require('mysql2');
const {
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_DATABASE,
    DB_CONNECT_LIMIT
} = require('../config');
const connection = mysql.createPool({
    connectionLimit: DB_CONNECT_LIMIT,
    host: DB_HOST,
    user: DB_USER,
    database: DB_DATABASE,
    password: DB_PASS
});

module.exports = connection.promise();