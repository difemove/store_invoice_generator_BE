const dbParameters= require('../config/db.config')
const mysql = require('mysql')

let dbPool 

function getPool() {
    if (dbPool) return dbPool
    dbPool = mysql.createPool(dbParameters)
    return dbPool
}

module.exports = getPool

