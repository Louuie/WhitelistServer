const mysql = require('mysql')
const env = require('dotenv').config()

let MySQLConn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

async function createTable() {
    const sql = `CREATE TABLE IF NOT EXISTS ${process.env.DB_TABLE} (uuid VARCHAR(255), PRIMARY KEY(uuid))`
    MySQLConn.query(sql, function(err, result) {
        if (err) throw err;
        console.log(`creating ${process.env.DB_TABLE} table if it does already exist!`)
    })
}


async function queryAllPlayers() {
    MySQLConn.query(`SELECT * FROM ${process.env.DB_TABLE}`, function (err, result) {
        if (err) throw err
        console.log(result)
        return result
    })
}


module.exports = {MySQLConn, createTable, queryAllPlayers}