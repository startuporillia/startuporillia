import { lastDayOfMonth, subDays, getDay, addMonths, format, startOfDay, isBefore } from "date-fns";

export interface Event {
  date: string;
  title: string;
  description: string;
  time: string;
  location: string;
  cost: string;
}

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
      const tz = getTimezoneLabel(cursor.getMonth());
      events.push({
        date: format(lastTuesday, "EEEE, MMMM d"),
        title: "Startup Orillia Coworking Day",
        description:
          "Join us for coffee, coworking, and conversation with the Startup Orillia community.",
        time: `9:00 AM - 1:00 PM ${tz}`,
        location: "Creative Nomad Studios",
        cost: "Free! (Sponsored by Creative Nomad Studios)",
      });
    }

    cursor = addMonths(cursor, 1);
  }

  return events;
}

// Auto-generated from the recurring schedule
export const upcomingEvents: Event[] = generateUpcomingCoworkingDays(3);

// Historical past events (pre-recurring schedule)
export const pastEvents: Event[] = [
  {
    date: "Tuesday, January 27",
    title: "Startup Orillia Coworking Day",
    description:
      "Join us for coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EST",
    location: "Creative Nomad Studios",
    cost: "Free! (Sponsored by Creative Nomad Studios)",
  },
  {
    date: "Wednesday, November 5",
    title: "Startup Orillia Coworking Day",
    description:
      "Join us for coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EST",
    location: "Creative Nomad Studios",
    cost: "Free! (Sponsored by Creative Nomad Studios)",
  },
  {
    date: "Wednesday, August 20",
    title: "Startup Orillia Coworking Day",
    description:
      "Join us for coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios",
    cost: "Free! (Sponsored by Creative Nomad Studios)",
  },
  {
    date: "Thursday, July 31",
    title: "Startup Orillia Coworking Day",
    description:
      "Join us for coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios",
    cost: "Free! (Sponsored by Creative Nomad Studios)",
  },
  {
    date: "Tuesday, July 15",
    title: "Startup Orillia Coworking Day",
    description:
      "Join us for coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios",
    cost: "Free! (Sponsored by Creative Nomad Studios)",
  },
  {
    date: "Thursday, June 5",
    title: "Startup Orillia Coworking Day",
    description:
      "A great day of coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios, 23 Mississaga Street West Orillia, ON L3V 3A5",
    cost: "Free! (Sponsored by Creative Nomad Studios)",
  },
  {
    date: "Wednesday, June 26",
    title: "Startup Orillia Coworking Day",
    description:
      "Another fantastic session of coffee, coworking, and conversation with the Startup Orillia community.",
    time: "9:00 AM - 1:00 PM EDT",
    location: "Creative Nomad Studios, 23 Mississaga Street West Orillia, ON L3V 3A5",
    cost: "Free! (Sponsored by Creative Nomad Studios)",
  },
];

export const getNextMeetup = (): Event | null => {
  return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
};
