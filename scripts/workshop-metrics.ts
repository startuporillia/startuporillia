/**
 * Prints a digest of workshop interest + registration data. Used by the
 * CLAUDE playbook for "show me what's resonating" style queries.
 *
 * Usage:
 *   npm run metrics              # default digest across all workshops
 *   npm run metrics -- slug      # focus on one workshop
 *
 * Requires DATABASE_URL in env. Run `vercel env pull` first if needed.
 */

import { neon } from "@neondatabase/serverless";
import { workshops } from "../src/lib/workshops";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Run `vercel env pull` or export it.");
  process.exit(1);
}

const sql = neon(url);
const focusSlug = process.argv[2];

const formatNum = (n: number | null, digits = 1) =>
  n === null || Number.isNaN(n) ? "—" : Number(n).toFixed(digits);

interface DigestRow {
  workshop_slug: string;
  interest_count: number;
  avg_likelihood: number | null;
  high_intent_count: number;
  reservations: number;
  paid_count: number;
  first_signup: string | null;
  latest_signup: string | null;
}

async function digest() {
  const rows = (await sql`
    SELECT
      slug AS workshop_slug,
      COALESCE(i.interest_count, 0)::int AS interest_count,
      i.avg_likelihood::float AS avg_likelihood,
      COALESCE(i.high_intent_count, 0)::int AS high_intent_count,
      COALESCE(r.reservations, 0)::int AS reservations,
      COALESCE(r.paid_count, 0)::int AS paid_count,
      i.first_signup,
      i.latest_signup
    FROM (
      SELECT DISTINCT workshop_slug AS slug FROM workshop_interest
      UNION
      SELECT DISTINCT workshop_slug AS slug FROM workshop_registration
    ) all_slugs
    LEFT JOIN (
      SELECT
        workshop_slug,
        COUNT(*) AS interest_count,
        AVG(would_attend) AS avg_likelihood,
        COUNT(*) FILTER (WHERE would_attend >= 4) AS high_intent_count,
        MIN(created_at) AS first_signup,
        MAX(created_at) AS latest_signup
      FROM workshop_interest
      GROUP BY workshop_slug
    ) i USING (workshop_slug)
    LEFT JOIN (
      SELECT
        workshop_slug,
        COUNT(*) AS reservations,
        COUNT(*) FILTER (WHERE status = 'paid') AS paid_count
      FROM workshop_registration
      GROUP BY workshop_slug
    ) r USING (workshop_slug)
    ORDER BY interest_count DESC NULLS LAST, avg_likelihood DESC NULLS LAST
  `) as DigestRow[];

  if (rows.length === 0) {
    console.log("No interest or registrations recorded yet.");
    return;
  }

  const byWorkshop = new Map(workshops.map((w) => [w.slug, w]));

  console.log("\nWorkshop interest + registration digest");
  console.log("═══════════════════════════════════════\n");
  for (const r of rows) {
    const w = byWorkshop.get(r.workshop_slug);
    const title = w?.title ?? `[unknown: ${r.workshop_slug}]`;
    const price = w ? `$${w.price.regular}` : "—";
    const status = w?.status ?? "—";
    const conv =
      r.interest_count > 0
        ? formatNum((r.reservations / r.interest_count) * 100, 0)
        : "—";

    console.log(`• ${title}`);
    console.log(`    slug          : ${r.workshop_slug}`);
    console.log(`    status / price: ${status} · ${price} CAD`);
    console.log(`    interest      : ${r.interest_count} signups (high-intent ${r.high_intent_count})`);
    console.log(`    avg likelihood: ${formatNum(r.avg_likelihood)}/5`);
    console.log(`    reservations  : ${r.reservations} (paid ${r.paid_count}) · ${conv}% interest→reserve`);
    console.log(`    first / latest: ${r.first_signup ?? "—"} → ${r.latest_signup ?? "—"}\n`);
  }

  // Workshops with no activity yet
  const seen = new Set(rows.map((r) => r.workshop_slug));
  const cold = workshops.filter((w) => !seen.has(w.slug));
  if (cold.length > 0) {
    console.log("Workshops with no signups yet:");
    for (const w of cold) console.log(`  ◦ ${w.title}  (${w.slug})`);
    console.log();
  }
}

async function focused(slug: string) {
  const w = workshops.find((x) => x.slug === slug);
  const title = w?.title ?? slug;
  console.log(`\n${title}\n${"─".repeat(title.length)}`);
  if (w) {
    console.log(`  Status: ${w.status} · Price: $${w.price.regular} CAD\n`);
  }

  const interest = (await sql`
    SELECT email, name, would_attend, preferred_timing, notes, created_at, updated_at
    FROM workshop_interest
    WHERE workshop_slug = ${slug}
    ORDER BY would_attend DESC NULLS LAST, created_at DESC
  `) as Array<{
    email: string;
    name: string | null;
    would_attend: number | null;
    preferred_timing: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
  }>;

  console.log(`Interest (${interest.length})`);
  if (interest.length === 0) console.log("  (none yet)");
  for (const r of interest) {
    console.log(
      `  • ${r.name ?? "—"}  <${r.email}>  likelihood=${r.would_attend ?? "—"}/5  timing=${r.preferred_timing ?? "—"}`,
    );
    if (r.notes) console.log(`      notes: ${r.notes}`);
  }

  const reg = (await sql`
    SELECT email, name, source, status, amount_paid_cents, currency, created_at
    FROM workshop_registration
    WHERE workshop_slug = ${slug}
    ORDER BY created_at DESC
  `) as Array<{
    email: string;
    name: string | null;
    source: string;
    status: string;
    amount_paid_cents: number | null;
    currency: string | null;
    created_at: string;
  }>;

  console.log(`\nRegistrations (${reg.length})`);
  if (reg.length === 0) console.log("  (none yet)");
  for (const r of reg) {
    const paid =
      r.amount_paid_cents !== null
        ? `${(r.amount_paid_cents / 100).toFixed(2)} ${r.currency ?? ""}`
        : "—";
    console.log(
      `  • ${r.name ?? "—"}  <${r.email}>  source=${r.source}  status=${r.status}  paid=${paid}`,
    );
  }
}

async function main() {
  if (focusSlug) {
    await focused(focusSlug);
  } else {
    await digest();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
