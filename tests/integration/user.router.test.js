const request = require("supertest");
const express = require("express");
const mysql = require("mysql2/promise");
const { GenericContainer, Wait } = require("testcontainers");
const { createUserRouter } = require("../../src/resources/users.js");

describe("GET /users (mysql integration)", () => {
  let container;
  let connection;

  jest.setTimeout(30000);

  beforeAll(async () => {
    container = await new GenericContainer("mysql:8")
      .withEnvironment({
        MYSQL_ROOT_PASSWORD: "root",
        MYSQL_DATABASE: "testdb",
      })
      .withExposedPorts(3306)
      .withWaitStrategy(Wait.forListeningPorts())
      .start();

    const host = container.getHost();
    const port = container.getMappedPort(3306);

    // retry simple (évite connection lost)
    for (let i = 0; i < 10; i++) {
      try {
        connection = await mysql.createConnection({
          host,
          port,
          user: "root",
          password: "root",
          database: "testdb",
        });

        await connection.query("SELECT 1");
        break;
      } catch (e) {
        void e;
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255)
      );
    `);
  });

  afterAll(async () => {
    if (connection) {await connection.end();}
    if (container) {await container.stop();}
  });

  beforeEach(async () => {
    await connection.query("TRUNCATE TABLE users");

    await connection.query(`
      INSERT INTO users (first_name)
      VALUES ('John'), ('Jane');
    `);
  });

  test("returns users from mysql", async () => {
    const service = {
      users: async () => {
        const [rows] = await connection.query("SELECT * FROM users");
        return rows;
      },
    };

    const app = express();
    app.use(createUserRouter(service));

    const res = await request(app).get("/users");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });
});
