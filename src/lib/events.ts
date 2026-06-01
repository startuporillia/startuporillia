import { lastDayOfMonth, subDays, getDay, addMonths, format, startOfDay, isBefore } from "date-fns";

/**
 * Per-event Luma URLs for upcoming coworking days, keyed by YYYY-MM-DD of the
 * coworking date (in Eastern Time). Fill in as Luma events are created.
 * Unkeyed dates render without an RSVP button (falls back to WhatsApp CTA).
 */
const COWORKING_LUMA_URLS: Record<string, string> = {
  "2026-05-26": "https://lu.ma/w4q3xgtg",
  "2026-06-30": "https://lu.ma/peaf4jnz",
  "2026-07-28": "https://lu.ma/1wq1emin",
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
  const today = startOfDay(new Date());
  const events: Event[] = [];
  let cursor = new Date(today.getFullYear(), today.getMonth(), 1);

  while (events.length < count) {
    const lastTuesday = getLastTuesday(cursor.getFullYear(), cursor.getMonth());

    if (!isBefore(lastTuesday, today)) {
      const month = cursor.getMonth();
      const tz = getTimezoneLabel(month);
      const offset = easternUtcOffset(month);
      const y = lastTuesday.getFullYear();
      const m = lastTuesday.getMonth();
      const d = lastTuesday.getDate();

      // 9 AM Eastern → UTC; 1 PM Eastern → UTC
      const startDate = new Date(Date.UTC(y, m, d, 9 + offset, 0, 0));
      const endDate = new Date(Date.UTC(y, m, d, 13 + offset, 0, 0));

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

// Upcoming events. One-off partner/community entries listed explicitly,
// recurring coworking days appended via the generator. Order doesn't matter
// — the Events page sorts chronologically.
export const upcomingEvents: Event[] = [
  {
    date: "Thursday, June 18",
    title: "The Reframe Workshop: Breathe. Root. Lead.",
    description:
      "Half-day in-person workshop for founders, leaders, and high performers. Reset stress, reconnect with what matters, and rewire your nervous system through breath, body, and Japanese leadership disciplines. Led by Anette Lan (author of Ensō, tech CEO) and Brian Coones (breathwork specialist, TEDx speaker).",
    time: "9:30 AM - 12:30 PM EDT",
    location: "Creative Nomad Studios, 23 Mississaga St W, Orillia, ON",
    cost: "See ticket page for pricing",
    type: "partner",
    rsvpUrl: "https://www.creativenomad.ca/tickets",
    startDate: new Date(Date.UTC(2026, 5, 18, 13, 30, 0)),
    endDate: new Date(Date.UTC(2026, 5, 18, 16, 30, 0)),
  },
  ...generateUpcomingCoworkingDays(3),
];

// Historical past events (pre-recurring schedule). No startDate/endDate, so calendar buttons don't apply.
export const pastEvents: Event[] = [
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
