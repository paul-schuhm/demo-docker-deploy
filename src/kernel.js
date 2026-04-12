const express = require("express");
const { createUserRouter } = require("./resources/users");
const { createUserService } = require("./services/userService");
const UserRepository = require("./repositories/mysqlUserRepository");

async function run() {

  const app = express();
  app.use(express.json());

  const repository = new UserRepository();
  const service = createUserService(repository);
  app.use("/v1/", createUserRouter(service));

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`web API running on http://localhost:${PORT}`);
  });
}

run().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});


