import { neon } from "@neondatabase/serverless";

export const config = { runtime: "edge" };

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

const isEmail = (s: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const trim = (v: unknown, max: number): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const toInt = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : typeof v === "string" ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : null;
};

const hashIp = async (ip: string, salt: string): Promise<string> => {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return json({ error: "Database not configured" }, 503);
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  // Honeypot — bots fill this, humans don't see it
  if (typeof body.website === "string" && body.website.length > 0) {
    return json({ ok: true });
  }

  const workshop_slug = trim(body.workshop_slug, 100);
  const email = trim(body.email, 200).toLowerCase();
  const name = trim(body.name, 100) || null;
  const would_attend = toInt(body.would_attend);
  const price_tolerance = toInt(body.price_tolerance);
  const preferred_timing = trim(body.preferred_timing, 200) || null;
  const notes = trim(body.notes, 2000) || null;

  if (!workshop_slug || !email || !isEmail(email)) {
    return json({ error: "workshop_slug and a valid email are required" }, 400);
  }
  if (would_attend !== null && (would_attend < 1 || would_attend > 5)) {
    return json({ error: "would_attend must be 1-5" }, 400);
  }

  const user_agent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "";
  const ip_hash = ip ? await hashIp(ip, databaseUrl) : null;

  try {
    const sql = neon(databaseUrl);
    await sql`
      INSERT INTO workshop_interest (
        workshop_slug, email, name, would_attend, price_tolerance,
        preferred_timing, notes, user_agent, ip_hash
      ) VALUES (
        ${workshop_slug}, ${email}, ${name}, ${would_attend}, ${price_tolerance},
        ${preferred_timing}, ${notes}, ${user_agent}, ${ip_hash}
      )
      ON CONFLICT (workshop_slug, email) DO UPDATE SET
        name = EXCLUDED.name,
        would_attend = EXCLUDED.would_attend,
        price_tolerance = EXCLUDED.price_tolerance,
        preferred_timing = EXCLUDED.preferred_timing,
        notes = EXCLUDED.notes,
        user_agent = EXCLUDED.user_agent,
        ip_hash = EXCLUDED.ip_hash,
        updated_at = NOW()
    `;
    return json({ ok: true });
  } catch (err) {
    console.error("interest insert failed", err);
    return json({ error: "Could not record interest" }, 500);
  }
}
