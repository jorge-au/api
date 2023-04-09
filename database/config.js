const mysql = require("mysql2");
const util = require("util");

const pool = mysql.createPool({
    host: process.env.db__host,
    database: process.env.db__name,
    user: process.env.db__user
});

pool.getConnection((err) => {
    if(err) {
        console.log("No conectado", {"error": err});
    } else {
        console.log("Conexion a B.D establecida")
    }
});

pool.query = util.promisify(pool.query);

module.exports = pool;