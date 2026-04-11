const express = require("express");
const { createConcertRouter } = require("./resources/concerts");
const { createConcertService } = require("./services/concertService");
const PgConcertRepository = require("./repositories/pgConcertRepository");
const { createPoolFromEnv } = require("./db");

async function run() {
  const pool = createPoolFromEnv();

  const repository = new PgConcertRepository(pool);
  const service = createConcertService(repository);

  const app = express();
  app.use(express.json());
  app.use("/v1/concerts", createConcertRouter(service));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`web API running on http://localhost:${PORT}`);
  });
}

run().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

