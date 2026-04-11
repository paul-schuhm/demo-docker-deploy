const { getPool } = require("../db");
const ConcertRepository = require("./concertRepository");
const { createConcert } = require("../domain/concert");

class PgConcertRepository extends ConcertRepository {
  async findAll() {
    try {
      const { rows } = await getPool().query(
        'SELECT id, name, date FROM concerts ORDER BY id'
      );

      return rows.map(row =>
        createConcert({
          id: row.id,
          name: row.name,
          date: row.date,
        })
      );
    } catch (err) {
      throw new Error('Failed to fetch concerts');
    }
  }
}

module.exports = PgConcertRepository;
