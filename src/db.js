const { Pool } = require("pg");

let pool = null;

/**
 * Initialise le pool avec config explicite (tests, testcontainers)
 */
function createPool(config) {
  if (pool) return pool;

  pool = new Pool(config);

  pool.on("error", (err) => {
    console.error("Unexpected DB error", err);
    process.exit(1);
  });

  return pool;
}

/**
 * Initialise depuis variables d’environnement (prod / docker)
 */
function createPoolFromEnv() {
  return createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

/**
 * Accès global (utilisé par les repositories)
 */
function getPool() {
  if (!pool) {
    throw new Error("DB not initialized. Call createPool first.");
  }
  return pool;
}

/**
 * Fermeture propre (tests, shutdown)
 */
async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = {
  createPool,
  createPoolFromEnv,
  getPool,
  closePool,
};
