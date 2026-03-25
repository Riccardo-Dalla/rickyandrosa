import { sql } from "@vercel/postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS commitments (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL,
      activity_id   TEXT NOT NULL,
      activity_name TEXT NOT NULL,
      cost_range    TEXT DEFAULT 'Varies',
      message       TEXT,
      photo_url     TEXT,
      is_private    BOOLEAN DEFAULT false,
      completed     BOOLEAN DEFAULT false,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      last_reminded_at TIMESTAMPTZ
    )
  `;

  await sql`
    ALTER TABLE commitments ADD COLUMN IF NOT EXISTS last_reminded_at TIMESTAMPTZ
  `;

  console.log("commitments table created/updated.");

  await sql`
    CREATE TABLE IF NOT EXISTS guests (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL UNIQUE,
      address    TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  console.log("guests table created/updated.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to set up database:", err);
  process.exit(1);
});
