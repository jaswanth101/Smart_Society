import { registerAs } from '@nestjs/config'

// ─────────────────────────────────────────────────────────
// Database configuration — PostgreSQL primary + MongoDB Atlas.
// Uses schema-per-tenant isolation (see Architecture.md §3).
// ─────────────────────────────────────────────────────────

export default registerAs('database', () => ({
  // PostgreSQL (Primary relational database)
  postgres: {
    host:     process.env.PG_HOST     ?? 'localhost',
    port:     parseInt(process.env.PG_PORT ?? '5432', 10),
    username: process.env.PG_USER     ?? 'ss360',
    password: process.env.PG_PASSWORD ?? '',
    database: process.env.PG_DATABASE ?? 'smartsociety360',
    ssl:      process.env.PG_SSL === 'true',
    // Schema-per-tenant — migrations run on 'public' schema only
    synchronize: process.env.NODE_ENV === 'development',
    logging:     process.env.PG_LOGGING === 'true',
  },
  // MongoDB Atlas (IoT event store — high-velocity unstructured data)
  mongodb: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/smartsociety_iot',
  },
}))
