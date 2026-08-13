import { neon } from "@neondatabase/serverless";
import type { Snapshot } from "./wnba";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set — add it to .env.local");
  return neon(url);
}

export async function ensureTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS wnba_snapshots (
      date DATE PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

export async function writeSnapshot(snapshot: Snapshot) {
  const sql = getSql();
  await ensureTable();
  await sql`
    INSERT INTO wnba_snapshots (date, data)
    VALUES (${snapshot.date}, ${JSON.stringify(snapshot)})
    ON CONFLICT (date) DO UPDATE SET data = EXCLUDED.data, created_at = now()
  `;
}

export async function readSnapshot(date: string): Promise<Snapshot | null> {
  const sql = getSql();
  await ensureTable();
  const rows = await sql`SELECT data FROM wnba_snapshots WHERE date = ${date}`;
  return rows.length > 0 ? (rows[0].data as Snapshot) : null;
}
