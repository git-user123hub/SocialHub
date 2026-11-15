import postgres from "postgres";

const globalForDb = globalThis;

export const sql = globalForDb.sql || postgres(process.env.DATABASE_URL);

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}
