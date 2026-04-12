const { connexion } = require("../db");
const UserRepository = require("./userRepository");
const { User } = require("../domain/user");

class MySQLUserRepository extends UserRepository {
  async findAll() {
    try {
      const conn = await connexion();

      const [rows] = await conn.execute(
        "SELECT id, first_name FROM User ORDER BY id",
      );
      return rows.map((row) => new User(row.id, row.first_name));
    } catch (err) {
      throw new Error("Failed to fetch users");
    }
  }
}

module.exports = MySQLUserRepository;
