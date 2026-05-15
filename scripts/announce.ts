/**
 * Prints a draft announcement email + the opt-in subscriber list for a workshop
 * that's just been flipped to `scheduled`. Copy-paste output into Loops, Gmail,
 * or wherever you send announcements.
 *
 * Usage:
 *   npm run announce -- claude-code-101
 *
 * Requires DATABASE_URL.
 */

import { neon } from "@neondatabase/serverless";
import { getWorkshop } from "../src/lib/workshops";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Run `vercel env pull` or export it.");
  process.exit(1);
}

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npm run announce -- <workshop-slug>");
  process.exit(1);
}

const workshop = getWorkshop(slug);
if (!workshop) {
  console.error(`No workshop with slug "${slug}".`);
  process.exit(1);
}

const sql = neon(url);

const formatPrice = (): string => `$${workshop.price.regular} ${workshop.price.currency}`;

async function main() {
  const rows = (await sql`
    SELECT email, name, created_at
    FROM workshop_interest
    WHERE workshop_slug = ${slug}
    ORDER BY created_at ASC
  `) as Array<{ email: string; name: string | null; created_at: string }>;

  const dateLabel = workshop!.scheduledTimeLabel ?? "[no date set — set scheduledTimeLabel first]";
  const lumaLine = workshop!.lumaUrl
    ? `Reserve your seat → ${workshop!.lumaUrl}`
    : "Reserve your seat → https://startuporillia.ca/workshops/" + slug + " (Luma link will be in this page when tickets open)";

  console.log("═".repeat(72));
  console.log("DRAFT ANNOUNCEMENT");
  console.log("═".repeat(72));
  console.log();
  console.log(`Subject: ${workshop!.title} is happening — ${dateLabel}`);
  console.log();
  console.log("─".repeat(72));
  console.log(`Hey,

A while back you asked to be notified when "${workshop!.title}" was scheduled. It's on:

  ${dateLabel}
  Creative Nomad Studios, Orillia

  ${formatPrice()}
  ${workshop!.capacity.min}-${workshop!.capacity.max} people, in person

${workshop!.tagline}

${lumaLine}

The early-bird seats go fast — happy to answer any questions if you reply to this.

— Dave
Startup Orillia
https://startuporillia.ca/workshops/${slug}
`);
  console.log("─".repeat(72));
  console.log();

  if (rows.length === 0) {
    console.log("⚠  No opt-in subscribers yet for this workshop.");
    console.log();
    return;
  }

  console.log(`OPT-IN LIST (${rows.length})`);
  console.log("─".repeat(72));
  console.log(rows.map((r) => r.email).join(", "));
  console.log();
  console.log("Or one per line:");
  for (const r of rows) {
    console.log(`  ${r.email}${r.name ? `  (${r.name})` : ""}`);
  }
  console.log();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
