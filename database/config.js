const mysql = require("mysql2");
const util = require("util");

const pool = mysql.createPool({
    host: process.env.DB__HOST,
    database: process.env.DB__NAME,
    user: process.env.DB__USER
});

pool.getConnection((err) => {
    if(err) {
        console.log("Hubo un error con la conexión de la B.D", {"error": err});
    } else {
        console.log("Conexion a B.D establecida")
    }
});

pool.query = util.promisify(pool.query);

module.exports = pool;