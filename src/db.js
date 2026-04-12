/**
 * Export et test de la connexion à la base de données MySQL
 */
const fs = require("fs").promises;
const mysql = require("mysql2/promise");

let pool = null;

async function buildDSN() {
  return {
    host: "database",
    user: "root",
    password: (
      await fs.readFile(process.env.MYSQL_ROOT_PASSWORD_FILE, "utf8")
    ).trim(),
    database: process.env.MYSQL_DATABASE,
  };
}

async function connexion() {
  if (!pool) {
    const dsn = await buildDSN();
    pool = mysql.createPool(dsn);
  }
  return pool;
}

/**
 * Une simple fonction test de la connexion à MySQL
 */
async function testConnexion() {
  const conn = await connexion();
  let [res] = await conn.execute("SELECT ? + ? AS solution", [1, 1]);
  console.log(res);
}

//testConnexion();

module.exports = { connexion };
