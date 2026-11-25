import { describe, expect, it } from "vitest";
import { generateUpcomingCoworkingDays, getHolidayNotice } from "../src/lib/events";

// Eastern-time instants expressed in UTC (November/December/January are EST, UTC-5).
const afterNovemberMeetup = new Date(Date.UTC(2026, 10, 24, 19, 0, 0)); // Nov 24, 2 PM EST
const duringNovemberMeetup = new Date(Date.UTC(2026, 10, 24, 15, 0, 0)); // Nov 24, 10 AM EST

describe("skipped coworking days", () => {
  it("never generates the Dec 29, 2026 holiday meetup", () => {
    const days = generateUpcomingCoworkingDays(3, afterNovemberMeetup);
    expect(days.map((d) => d.date)).toEqual([
      "Tuesday, January 26",
      "Tuesday, February 23",
      "Tuesday, March 30",
    ]);
    expect(days[0].startDate?.toISOString()).toBe("2027-01-26T14:00:00.000Z");
  });

  it("still lists the November meetup until it ends", () => {
    const [next] = generateUpcomingCoworkingDays(1, duringNovemberMeetup);
    expect(next.date).toBe("Tuesday, November 24");
  });
});

describe("holiday notice", () => {
  it("is hidden while the November meetup is still the next one", () => {
    expect(getHolidayNotice(duringNovemberMeetup)).toBeNull();
  });

  it("shows after the November meetup with the January date from the rule", () => {
    const notice = getHolidayNotice(afterNovemberMeetup);
    expect(notice?.nextMeetup?.date).toBe("Tuesday, January 26");
  });

  it("shows through New Year's Eve and hides itself on January 1 (Eastern)", () => {
    expect(getHolidayNotice(new Date(Date.UTC(2027, 0, 1, 4, 59, 0)))).not.toBeNull();
    expect(getHolidayNotice(new Date(Date.UTC(2027, 0, 1, 5, 0, 0)))).toBeNull();
  });
});
