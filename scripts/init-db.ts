/**
 * One-time schema setup for the workshop_interest table.
 *
 * Usage:
 *   1. Make sure DATABASE_URL is set in your shell. Either:
 *      - source .env.local      (recommended after `vercel env pull`)
 *      - export DATABASE_URL="postgres://..."
 *   2. npm run db:init
 *
 * Idempotent — safe to re-run.
 */

import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Run `vercel env pull` or export it.");
  process.exit(1);
}

const sql = neon(url);

async function main() {
  console.log("Creating workshop_interest table...");
  await sql`
    CREATE TABLE IF NOT EXISTS workshop_interest (
      id BIGSERIAL PRIMARY KEY,
      workshop_slug TEXT NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      would_attend SMALLINT,
      price_tolerance INTEGER,
      preferred_timing TEXT,
      notes TEXT,
      user_agent TEXT,
      ip_hash TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (workshop_slug, email)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_interest_slug ON workshop_interest (workshop_slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_interest_created ON workshop_interest (created_at DESC)`;

  console.log("Creating workshop_registration table...");
  await sql`
    CREATE TABLE IF NOT EXISTS workshop_registration (
      id BIGSERIAL PRIMARY KEY,
      workshop_slug TEXT NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      source TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'reserved',
      amount_paid_cents INTEGER,
      currency TEXT,
      luma_event_id TEXT,
      luma_guest_id TEXT,
      notes TEXT,
      user_agent TEXT,
      ip_hash TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (workshop_slug, email, source)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_reg_slug ON workshop_registration (workshop_slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_reg_status ON workshop_registration (status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_reg_created ON workshop_registration (created_at DESC)`;

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
