var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/resources/concerts.js
var require_concerts = __commonJS({
  "src/resources/concerts.js"(exports, module) {
    var express2 = __require("express");
    function createConcertRouter2(service) {
      const router = express2.Router();
      router.get("/concerts", async (req, res) => {
        const concerts = await service.getAllConcerts();
        res.json(concerts);
      });
      return router;
    }
    __name(createConcertRouter2, "createConcertRouter");
    module.exports = { createConcertRouter: createConcertRouter2 };
  }
});

// src/services/concertService.js
var require_concertService = __commonJS({
  "src/services/concertService.js"(exports, module) {
    function createConcertService2(repository) {
      return {
        async getAllConcerts() {
          return repository.findAll();
        }
      };
    }
    __name(createConcertService2, "createConcertService");
    module.exports = { createConcertService: createConcertService2 };
  }
});

// src/db.js
var require_db = __commonJS({
  "src/db.js"(exports, module) {
    var { Pool } = __require("pg");
    var pool = null;
    function createPool(config) {
      if (pool) return pool;
      pool = new Pool(config);
      pool.on("error", (err) => {
        console.error("Unexpected DB error", err);
        process.exit(1);
      });
      return pool;
    }
    __name(createPool, "createPool");
    function createPoolFromEnv2() {
      return createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
    }
    __name(createPoolFromEnv2, "createPoolFromEnv");
    function getPool() {
      if (!pool) {
        throw new Error("DB not initialized. Call createPool first.");
      }
      return pool;
    }
    __name(getPool, "getPool");
    async function closePool() {
      if (pool) {
        await pool.end();
        pool = null;
      }
    }
    __name(closePool, "closePool");
    module.exports = {
      createPool,
      createPoolFromEnv: createPoolFromEnv2,
      getPool,
      closePool
    };
  }
});

// src/repositories/concertRepository.js
var require_concertRepository = __commonJS({
  "src/repositories/concertRepository.js"(exports, module) {
    var ConcertRepository = class {
      static {
        __name(this, "ConcertRepository");
      }
      async findAll() {
        throw new Error("Not implemented");
      }
    };
    module.exports = ConcertRepository;
  }
});

// src/domain/concert.js
var require_concert = __commonJS({
  "src/domain/concert.js"(exports, module) {
    function createConcert({ id, name, date }) {
      return { id, name, date };
    }
    __name(createConcert, "createConcert");
    module.exports = { createConcert };
  }
});

// src/repositories/pgConcertRepository.js
var require_pgConcertRepository = __commonJS({
  "src/repositories/pgConcertRepository.js"(exports, module) {
    var { getPool } = require_db();
    var ConcertRepository = require_concertRepository();
    var { createConcert } = require_concert();
    var PgConcertRepository2 = class extends ConcertRepository {
      static {
        __name(this, "PgConcertRepository");
      }
      async findAll() {
        try {
          const { rows } = await getPool().query(
            "SELECT id, name, date FROM concerts ORDER BY id"
          );
          return rows.map(
            (row) => createConcert({
              id: row.id,
              name: row.name,
              date: row.date
            })
          );
        } catch (err) {
          throw new Error("Failed to fetch concerts");
        }
      }
    };
    module.exports = PgConcertRepository2;
  }
});

// src/kernel.js
var express = __require("express");
var { createConcertRouter } = require_concerts();
var { createConcertService } = require_concertService();
var PgConcertRepository = require_pgConcertRepository();
var { createPoolFromEnv } = require_db();
async function run() {
  const pool = createPoolFromEnv();
  const repository = new PgConcertRepository(pool);
  const service = createConcertService(repository);
  const app = express();
  app.use(express.json());
  app.use("/v1/concerts", createConcertRouter(service));
  const PORT = process.env.PORT || 3e3;
  app.listen(PORT, () => {
    console.log(`web API running on http://localhost:${PORT}`);
  });
}
__name(run, "run");
run().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
//# sourceMappingURL=server.js.map
