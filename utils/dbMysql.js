const mysql = require('mysql')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'root',
    database: 'news'
})


module.exports = db;