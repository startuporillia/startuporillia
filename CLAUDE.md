# Startup Orillia Website

React + Vite + TypeScript SPA deployed to Vercel.

## Stack

- **Build**: Vite
- **UI**: React 18, Tailwind CSS, shadcn/ui (Radix primitives)
- **Routing**: React Router DOM (SPA — `vercel.json` rewrites everything *except* `/api/*` to `/index.html`)
- **Date logic**: date-fns
- **Backend**: Vercel Edge functions in `/api/`, Neon Postgres (free tier) via the `@neondatabase/serverless` driver
- **Deploy**: `npm run deploy` (`vercel --prod`); auto-deploys via Vercel Git integration on push to `main`

## Events / Meetup System

### How it works

Recurring coworking days are **auto-generated** in `src/lib/events.ts`. The function `generateUpcomingCoworkingDays(3)` computes the last Tuesday of each month using date-fns and always produces the next 3 upcoming events from today's date. No manual editing is needed for the regular monthly schedule.

- `upcomingEvents` — auto-generated, always current
- `pastEvents` — static array of historical events (pre-recurring schedule)
- `getNextMeetup()` — returns the first upcoming event, used by the hero card

### Key files

- `src/lib/events.ts` — event data, generation logic, and `Event` interface
- `src/components/sections/EventsSection.tsx` — upcoming + past event display, RSVP dialog
- `src/components/sections/HeroSection.tsx` — hero with next meetup card
- `src/components/sections/MeetupInfoSection.tsx` — general meetup info ("Last Tuesday of every month")

### Adding a one-off special event

To add a non-recurring event (e.g., Pitch Day), add it directly to the `upcomingEvents` array in `events.ts` alongside the generated ones:

```ts
export const upcomingEvents: Event[] = [
  // One-off event
  {
    date: "Saturday, March 15",
    title: "Startup Orillia Pitch Day",
    description: "...",
    time: "6:00 PM - 9:00 PM EST",
    location: "Creative Nomad Studios",
    cost: "Free!",
  },
  // Regular recurring meetups
  ...generateUpcomingCoworkingDays(3),
];
```

Move it to `pastEvents` once it's over, or remove it.

### Changing the recurring schedule

To change the day or frequency, edit the `generateUpcomingCoworkingDays` function and the `getLastTuesday` helper in `src/lib/events.ts`. The timezone label logic (`getTimezoneLabel`) assumes Eastern Time with Mar-Oct = EDT, Nov-Feb = EST.

## Workshops + Community Profiles

### Mental model

- **Profiles** (`src/lib/profiles.ts`) are the registry of community members. Each profile is referenced by `slug` (e.g. `"dave-caplan"`).
- **Workshops** (`src/lib/workshops.ts`) are the catalog. Each workshop has a `leadSlug` pointing at a profile, a `track` (ai / founder / build / ops), and a `level` (1-5 per-track; can also be a range like `[2, 3]`).
- **Status** is the lifecycle flag that drives the UI on `/workshops/:slug`:
  - `interest` → embedded interest form posts to `/api/interest`
  - `scheduled` → date + price + Luma RSVP button
  - `sold-out` → Luma waitlist link
  - `past` → "schedule a return" interest form
- Routes: `/workshops` (catalog with track filter) · `/workshops/:slug` (detail) · `/community` (profile grid).

### Adding a new community profile

Add to `profiles` in `src/lib/profiles.ts`. Photo goes in `/public/` (e.g. `/public/jane.jpg`).

```ts
{
  slug: "jane-doe",
  name: "Jane Doe",
  title: "Founder, Example Co · Designer",
  bio: "...",
  photo: "/jane.jpg",
  linkedin: "https://...",
  tags: ["Designer", "Founder"],
  teaches: ["build"],   // optional: tracks they can lead
}
```

### Adding a new workshop

Add to `workshops` in `src/lib/workshops.ts`. Required: `slug`, `title`, `tagline`, `track`, `level`, `durationMinutes`, `capacity`, `status`, `leadSlug`, `price`, `whoFor`, `youWillLeaveWith`, `whatYouWillLearn`, `description`. Optional: `agenda`, `prerequisites`, `coLeadSlugs`, `scheduledDate`, `scheduledTimeLabel`, `lumaUrl`.

Always set a real `price` from `PRICE_TIERS` (or a custom override):

| Tier | Duration | Pricing (CAD) |
|---|---|---|
| `PRICE_TIERS.short` | 90 min | $125 |
| `PRICE_TIERS.compact` | 2 hr | $165 |
| `PRICE_TIERS.halfDay` | 3 hr | $295 |
| `PRICE_TIERS.intensive` | 4 hr | $395 |

**Default slot**: Wednesday 9 AM EDT/EST at Creative Nomad Studios. Use this unless the user requests otherwise.

Start every new workshop in `status: "interest"`. **Don't ask attendees what they'd pay** — show the price and let behavior (notify-me signups + reservations) be the signal.

### Scheduling a workshop (interest → scheduled)

Standard flow — Dave says something like "Schedule Claude Code 101 for Wed June 3 at 9 AM" and future-Claude does:

1. Update the workshop entry in `src/lib/workshops.ts`:
   - `status: "interest"` → `status: "scheduled"`
   - Add `scheduledDate: new Date(Date.UTC(YYYY, M-1, D, 9+offset, 0, 0))` — `offset` is 4 (EDT, Mar-Oct) or 5 (EST, Nov-Feb). Default start time is 9 AM ET (13:00 UTC in EDT, 14:00 UTC in EST).
   - Add `scheduledTimeLabel: "Wed June 17 · 9:00 AM - 12:00 PM EDT"` (end time = start + workshop.durationMinutes)
   - Optionally add `lumaUrl: "https://lu.ma/xxxx"` once the Luma event exists
   - Optionally override `price` if this run differs from the tier default
2. Commit + push. Vercel auto-deploys.
3. **Email the opt-in list**: `npm run announce -- <slug>` prints a draft message + the subscribers, copy/paste into Loops or Gmail. (Dormant until Neon is connected.)

**Default slot**: Wednesday mornings starting at 9 AM ET. End time matches workshop duration. Most halfDay workshops are 9 AM - 12 PM.

**No-Luma fallback**: it's safe to flip a workshop to `scheduled` *before* the Luma event exists. The detail page will show a "Tickets opening soon — drop your email" panel instead of the Reserve form. Add `lumaUrl` once the Luma event is created.

**No early-bird mechanic** — the price you set is the price. Confidence over discount theatre. If you ever want EB back, the schema for it lived on `WorkshopPrice` + `Workshop.earlyBirdUntil`; reinstate by adding optional `earlyBird?: number` and `earlyBirdUntil?: Date` fields.

### Marking a workshop sold out / past

- Sold out: set `status: "sold-out"`, keep `lumaUrl` so the page shows the waitlist link.
- Past: set `status: "past"`. The detail page flips to a "schedule a return" form.

### Workshop levels (per-track, 1-5)

Defined in `LEVEL_LABEL` and `LEVEL_DESCRIPTION` in `workshops.ts`. Display: numeric chip `L2` + word `Working` + 5-dot indicator.

- L1 Foundations · L2 Working · L3 Building · L4 Shipping · L5 Leading
- Levels are **per track** — an AI L2 is independent of a Founder L2.
- A workshop can span levels: set `level: [2, 3]` and the UI renders `L2-L3`.
- Prerequisites are advisory only, never enforced.

## Interest capture (Neon Postgres)

### One-time setup

1. In the Vercel dashboard for this project: **Storage → Add Storage → Marketplace → Neon Postgres**. Pick the free plan. Vercel auto-injects `DATABASE_URL` into the project.
2. Pull env vars locally:
   ```sh
   vercel env pull .env.local
   ```
3. Create the schema:
   ```sh
   npm run db:init
   ```
   This is idempotent — safe to re-run.

### Two tables, two flows

1. **`workshop_interest`** — captured by `WorkshopInterestForm` (email-only "Notify me" opt-in). Rendered on `interest` workshops, on `past` workshops as a "schedule a return" form, and on `scheduled` workshops *without* a `lumaUrl` yet (as the "Tickets opening soon" panel). POSTs to `/api/interest`. Upserts on `(workshop_slug, email)`.
2. **`workshop_registration`** — captured by `ReserveSeatForm` (name + email, then redirects to Luma). Rendered on `scheduled` and `sold-out` workshops *with* a `lumaUrl`. POSTs to `/api/register`. Upserts on `(workshop_slug, email, source)`.

Why single-field interest: we don't yet have a use case for richer signal (likelihood, timing, notes). When a workshop flips to scheduled, we send the opt-in list a single announcement via `npm run announce`. If we ever need richer signal, add fields back to the form — the API already accepts them.

The reservation log gives you funnel data even if the user bails mid-Luma-checkout. **Luma is still the source of truth for payments** — the table is a site-side log, not a replacement.

Both endpoints use the same honeypot field `website` and never block the user.

### Custom workshop builder (private team sessions)

`CustomWorkshopBuilder` (`src/components/CustomWorkshopBuilder.tsx`) is a modal-based form for booking a private workshop for a team. It's launched from a special "For your team" card always present in the Upcoming Workshops grid. Fields: topic (select from catalog or "Something else"), attendees (3-15), level (L1-L5 optional), notes, name, email.

Unlike the interest/registration flows, this submits **directly to Formspree** (the same form ID as the Contact page) — these are leads that need a human reply, not data to aggregate. The submission includes a synthesized message body that's email-friendly when it lands in Dave's inbox.

### Querying metrics from CLAUDE

`npm run metrics` prints a digest across all workshops:

```
• Claude Code 101
    slug          : claude-code-101
    status / price: interest · $147 CAD
    interest      : 12 signups (high-intent 7)
    avg likelihood: 4.3/5
    reservations  : 5 (paid 3) · 42% interest→reserve
    first / latest: 2026-05-12 → 2026-05-30
```

`npm run metrics -- claude-code-101` prints the full per-respondent list for one workshop (interest + registrations).

For ad-hoc questions, connect to Neon via `psql "$DATABASE_URL"` (or any Postgres client) and query the two tables directly.

```sql
-- Interest table
CREATE TABLE workshop_interest (
  id BIGSERIAL PRIMARY KEY,
  workshop_slug TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  would_attend SMALLINT,        -- 1-5 likelihood scale
  price_tolerance INTEGER,      -- legacy column, no longer populated
  preferred_timing TEXT,
  notes TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workshop_slug, email)
);

-- Registration table
CREATE TABLE workshop_registration (
  id BIGSERIAL PRIMARY KEY,
  workshop_slug TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  source TEXT NOT NULL,         -- 'site_click' | 'luma_webhook' | 'manual'
  status TEXT NOT NULL,         -- 'reserved' | 'paid' | 'cancelled' | 'attended' | 'no_show'
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
);
```

Useful queries:

```sql
-- High-intent people across all workshops
SELECT workshop_slug, email, would_attend
FROM workshop_interest
WHERE would_attend >= 4
ORDER BY would_attend DESC, created_at DESC;

-- Topic demand digest
SELECT
  workshop_slug,
  COUNT(*) AS signups,
  ROUND(AVG(would_attend), 1) AS avg_likelihood
FROM workshop_interest
GROUP BY workshop_slug
ORDER BY signups DESC, avg_likelihood DESC;

-- Interest → registration conversion per workshop
SELECT
  i.workshop_slug,
  COUNT(DISTINCT i.email) AS interested,
  COUNT(DISTINCT r.email) AS reserved,
  ROUND(100.0 * COUNT(DISTINCT r.email) / NULLIF(COUNT(DISTINCT i.email), 0), 0) AS conversion_pct
FROM workshop_interest i
LEFT JOIN workshop_registration r USING (workshop_slug, email)
GROUP BY i.workshop_slug
ORDER BY conversion_pct DESC NULLS LAST;

-- People who expressed interest AND reserved (warmest audience)
SELECT i.workshop_slug, i.email, i.would_attend, r.status
FROM workshop_interest i
JOIN workshop_registration r USING (workshop_slug, email)
ORDER BY i.would_attend DESC NULLS LAST;

-- New activity in the last 7 days
SELECT 'interest' AS kind, workshop_slug, email, created_at FROM workshop_interest
WHERE created_at > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 'register' AS kind, workshop_slug, email, created_at FROM workshop_registration
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Operational playbook

1. **Seed** new workshops in `status: "interest"` and push.
2. **Promote** via WhatsApp + next coworking day + LinkedIn.
3. **Check signal** with `npm run metrics` once a week.
4. **Schedule** the first workshop that clears ~10 signups at ≥ $147 average price tolerance. Aim for a date 2-4 weeks out. Floor 5 / cap 10.
5. **Refund and pivot** if the floor isn't hit by T-7 days — switch to the #2 topic.

## Build & Deploy

```sh
npm run dev                       # local dev server (port 8080)
npm run build                     # production build to dist/
npm run deploy                    # deploy to Vercel production (vercel --prod)
npm run db:init                   # one-time Neon schema setup (after `vercel env pull`)
npm run metrics                   # workshop interest + registration digest
npm run metrics -- <slug>         # focused view for one workshop
npm run announce -- <slug>        # draft announcement email + opt-in list for a scheduled workshop
```
