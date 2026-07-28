import { lastDayOfMonth, subDays, getDay, addMonths, format } from "date-fns";

/**
 * Per-event Luma URLs for upcoming coworking days, keyed by YYYY-MM-DD of the
 * coworking date (in Eastern Time). Fill in as Luma events are created.
 * Unkeyed dates render without an RSVP button (falls back to WhatsApp CTA).
 */
const COWORKING_LUMA_URLS: Record<string, string> = {
  "2026-05-26": "https://lu.ma/w4q3xgtg",
  "2026-06-30": "https://lu.ma/peaf4jnz",
  "2026-07-28": "https://lu.ma/1wq1emin",
  "2026-08-25": "https://lu.ma/0qd53gt3",
  "2026-09-29": "https://lu.ma/jdqmsjiy",
  "2026-10-27": "https://lu.ma/phybjwht",
  "2026-11-24": "https://lu.ma/ii6uysee",
};

export type EventType = "coworking" | "workshop" | "community" | "partner";

export interface Event {
  date: string;
  title: string;
  description: string;
  time: string;
  location: string;
  cost: string;
  type: EventType;
  rsvpUrl?: string;
  /** UTC start time. Optional for historical/past events where calendar links aren't needed. */
  startDate?: Date;
  /** UTC end time. Optional for historical/past events where calendar links aren't needed. */
  endDate?: Date;
  /** Internal route to a detail page (e.g. /workshops/<slug>). Renders the title as a link when set. */
  detailUrl?: string;
}

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  coworking: "Community Meetup",
  workshop: "Workshop",
  community: "Community Event",
  partner: "Partner Event",
};

/**
 * Get the last Tuesday of a given month/year.
 */
function getLastTuesday(year: number, month: number): Date {
  const lastDay = lastDayOfMonth(new Date(year, month));
  const dayOfWeek = getDay(lastDay); // 0=Sun, 1=Mon, 2=Tue, ...
  const daysBack = (dayOfWeek - 2 + 7) % 7;
  return subDays(lastDay, daysBack);
}

/**
 * For the last Tuesday of a month, determine EST vs EDT.
 * Mar-Oct: EDT (last Tue of March is always after DST starts on 2nd Sunday).
 * Nov-Feb: EST (last Tue of November is always after DST ends on 1st Sunday).
 */
function getTimezoneLabel(month: number): string {
  return month >= 2 && month <= 9 ? "EDT" : "EST";
}

/** UTC offset (in hours) for Eastern Time at this month: EDT = UTC-4, EST = UTC-5. */
function easternUtcOffset(month: number): number {
  return month >= 2 && month <= 9 ? 4 : 5;
}

/**
 * Generate the next `count` upcoming coworking day events
 * based on "last Tuesday of every month".
 */
function generateUpcomingCoworkingDays(count: number): Event[] {
  const now = new Date();
  const events: Event[] = [];
  let cursor = new Date(now.getFullYear(), now.getMonth(), 1);

  while (events.length < count) {
    const lastTuesday = getLastTuesday(cursor.getFullYear(), cursor.getMonth());

    const month = cursor.getMonth();
    const tz = getTimezoneLabel(month);
    const offset = easternUtcOffset(month);
    const y = lastTuesday.getFullYear();
    const m = lastTuesday.getMonth();
    const d = lastTuesday.getDate();

    // 9 AM Eastern → UTC; 1 PM Eastern → UTC
    const startDate = new Date(Date.UTC(y, m, d, 9 + offset, 0, 0));
    const endDate = new Date(Date.UTC(y, m, d, 13 + offset, 0, 0));

    // Keep today's coworking day listed until it actually ends at 1 PM.
    if (endDate.getTime() >= now.getTime()) {
      const isoKey = format(lastTuesday, "yyyy-MM-dd");
      events.push({
        date: format(lastTuesday, "EEEE, MMMM d"),
        title: "Startup Orillia Coworking Day",
        description:
          "Coffee, coworking, and conversation with the Startup Orillia community. Bring your laptop and ship something.",
        time: `9:00 AM - 1:00 PM ${tz}`,
        location: "Creative Nomad Studios, 23 Mississaga St W, Orillia, ON",
        cost: "Free (supported by the City of Orillia and Creative Nomad Studios)",
        type: "coworking",
        rsvpUrl: COWORKING_LUMA_URLS[isoKey],
        startDate,
        endDate,
      });
    }

    cursor = addMonths(cursor, 1);
  }

  return events;
}

/**
 * An event counts as upcoming until it actually ends (falling back to its start
 * time when there's no end). Entries with no `startDate` are historical records,
 * never upcoming.
 *
 * This is the guard that keeps a hand-added one-off from lingering on the site
 * after its date passes — every consumer reads the filtered `upcomingEvents`.
 */
export const isUpcoming = (event: Event, now: Date = new Date()): boolean => {
  if (!event.startDate) return false;
  return (event.endDate ?? event.startDate).getTime() >= now.getTime();
};

// One-off partner/community entries. Add new ones here alongside the generated
// coworking days — order doesn't matter (the Events page sorts chronologically)
// and anything whose date has passed drops out of `upcomingEvents` on its own.
const oneOffEvents: Event[] = [];

// Upcoming events: one-offs + recurring coworking days, date-filtered so a
// stale hand-added entry can never surface as "Next up".
export const upcomingEvents: Event[] = [
  ...oneOffEvents,
  ...generateUpcomingCoworkingDays(3),
].filter((e) => isUpcoming(e));

// Historical past events (pre-recurring schedule). No startDate/endDate, so calendar buttons don't apply.
export const pastEvents: Event[] = [
  {
    date: "Thursday, June 18",
    title: "The Reframe Workshop: Breathe. Root. Lead.",
    description:
      "Half-day in-person workshop for founders, leaders, and high performers, led by Anette Lan and Brian Coones.",
    time: "9:30 AM - 12:30 PM EDT",
    location: "Creative Nomad Studios",
    cost: "See ticket page for pricing",
    type: "partner",
  },
  {
    date: "Tuesday, January 27",
    title: "Startup Orillia Coworking Day",
    description:
      "Coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EST",
    location: "Creative Nomad Studios",
    cost: "Free (supported by the City of Orillia and Creative Nomad Studios)",
    type: "coworking",
  },
  {
    date: "Wednesday, November 5",
    title: "Startup Orillia Coworking Day",
    description:
      "Coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EST",
    location: "Creative Nomad Studios",
    cost: "Free (supported by the City of Orillia and Creative Nomad Studios)",
    type: "coworking",
  },
  {
    date: "Wednesday, August 20",
    title: "Startup Orillia Coworking Day",
    description:
      "Coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios",
    cost: "Free (supported by the City of Orillia and Creative Nomad Studios)",
    type: "coworking",
  },
  {
    date: "Thursday, July 31",
    title: "Startup Orillia Coworking Day",
    description:
      "Coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios",
    cost: "Free (supported by the City of Orillia and Creative Nomad Studios)",
    type: "coworking",
  },
  {
    date: "Tuesday, July 15",
    title: "Startup Orillia Coworking Day",
    description:
      "Coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios",
    cost: "Free (supported by the City of Orillia and Creative Nomad Studios)",
    type: "coworking",
  },
  {
    date: "Thursday, June 5",
    title: "Startup Orillia Coworking Day",
    description:
      "A great day of coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios, 23 Mississaga Street West Orillia, ON L3V 3A5",
    cost: "Free (supported by the City of Orillia and Creative Nomad Studios)",
    type: "coworking",
  },
  {
    date: "Wednesday, June 26",
    title: "Startup Orillia Coworking Day",
    description:
      "Another fantastic session of coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios, 23 Mississaga Street West Orillia, ON L3V 3A5",
    cost: "Free (supported by the City of Orillia and Creative Nomad Studios)",
    type: "coworking",
  },
];

export const getNextMeetup = (): Event | null => {
  // The hero "Next Meetup" card is community-meetup specific (it hardcodes
  // "Free" + Creative Nomad Studios), so only ever surface coworking days —
  // never a workshop or partner event that happens to sit first in the array.
  const meetups = upcomingEvents
    .filter((e) => e.type === "coworking")
    .sort((a, b) => (a.startDate?.getTime() ?? 0) - (b.startDate?.getTime() ?? 0));
  return meetups.length > 0 ? meetups[0] : null;
};

export const getEventsByType = (type: EventType): Event[] => {
  return upcomingEvents.filter((e) => e.type === type);
};
