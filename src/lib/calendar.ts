export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  url?: string;
}

/** Format a Date as iCalendar UTC timestamp: YYYYMMDDTHHMMSSZ */
const toIcsUtc = (d: Date): string =>
  d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Format a Date as Google/Outlook range format: YYYYMMDDTHHMMSSZ */
const toGoogleUtc = (d: Date): string => toIcsUtc(d);

/** Escape a string for ICS field (RFC 5545). */
const icsEscape = (s: string): string =>
  s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

export const googleCalendarUrl = (e: CalendarEvent): string => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${toGoogleUtc(e.start)}/${toGoogleUtc(e.end)}`,
    details: e.url ? `${e.description}\n\n${e.url}` : e.description,
    location: e.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const outlookWebUrl = (e: CalendarEvent): string => {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: e.title,
    startdt: e.start.toISOString(),
    enddt: e.end.toISOString(),
    body: e.url ? `${e.description}\n\n${e.url}` : e.description,
    location: e.location,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

export const yahooCalendarUrl = (e: CalendarEvent): string => {
  const durationMs = e.end.getTime() - e.start.getTime();
  const durationHours = Math.floor(durationMs / 3600000);
  const durationMinutes = Math.floor((durationMs % 3600000) / 60000);
  const dur = `${String(durationHours).padStart(2, "0")}${String(durationMinutes).padStart(2, "0")}`;
  const params = new URLSearchParams({
    v: "60",
    title: e.title,
    st: toGoogleUtc(e.start),
    dur,
    desc: e.url ? `${e.description}\n\n${e.url}` : e.description,
    in_loc: e.location,
  });
  return `https://calendar.yahoo.com/?${params.toString()}`;
};

/** Build a minimal RFC 5545 .ics file body. */
export const buildIcs = (e: CalendarEvent): string => {
  const dtstamp = toIcsUtc(new Date());
  const uid = `${dtstamp}-${Math.random().toString(36).slice(2, 10)}@startuporillia.ca`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Startup Orillia//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${toIcsUtc(e.start)}`,
    `DTEND:${toIcsUtc(e.end)}`,
    `SUMMARY:${icsEscape(e.title)}`,
    `DESCRIPTION:${icsEscape(e.url ? `${e.description}\n\n${e.url}` : e.description)}`,
    `LOCATION:${icsEscape(e.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

/** Trigger a download of a generated .ics file. */
export const downloadIcs = (e: CalendarEvent, filename = "event.ics"): void => {
  const ics = buildIcs(e);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
