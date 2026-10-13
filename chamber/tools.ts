import type { ChamberEvent, ChamberMember, ChamberResource, ChamberSnapshot } from "./schema.js";
import { searchEvents, searchMembers, searchResources, type MemberSearch } from "./search.js";

// Contact details are withheld until the Chamber approves sharing them through AI tools.
// Phone and email fields are dropped, and any that appear in free text point to the record's own listing instead.
const CONTACT = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}(?:\s*(?:ext\.?|x)\s*\d+)?/gi;
const redact = (text: string | undefined, listingUrl: string) => text?.replace(CONTACT, () => `[contact details: ${listingUrl}]`);

const publicMember = ({ phone: _phone, email: _email, ...member }: ChamberMember) => ({
  ...member,
  description: redact(member.description, member.sourceUrl),
  shortDescription: redact(member.shortDescription, member.sourceUrl),
});
const publicEvent = (event: ChamberEvent) => ({ ...event, description: redact(event.description, event.sourceUrl) });
const publicResource = (resource: ChamberResource) => ({ ...resource, description: redact(resource.description, resource.sourceUrl) });

export const freshness = (snapshot: ChamberSnapshot) => ({
  snapshotDate: snapshot.snapshotId,
  crawlDate: snapshot.generatedAt,
  source: snapshot.source,
  directoryUrl: "https://business.orillia.com/list",
  eventsCalendarUrl: "https://business.orillia.com/events",
  notice: "Chamber membership is not an endorsement or quality rating. Business and event information is based on a periodically refreshed snapshot of publicly available Orillia & District Chamber of Commerce information. Link each business or event to its Chamber listing (sourceUrl) for the latest official information, including contact details.",
});

export const memberSearchResult = (snapshot: ChamberSnapshot, input: MemberSearch) => ({
  ...freshness(snapshot),
  results: searchMembers(snapshot, input).map((member) => ({
    id: member.id,
    name: member.name,
    description: redact(member.shortDescription ?? member.description, member.sourceUrl),
    categories: member.categories,
    city: member.address?.city,
    website: member.website,
    sourceUrl: member.sourceUrl,
  })),
});

export const memberResult = (snapshot: ChamberSnapshot, id: string) => ({
  ...freshness(snapshot),
  member: (() => {
    const member = snapshot.members.find((entry) => entry.id === id || entry.slug === id || entry.sourceId === id);
    return member ? publicMember(member) : null;
  })(),
});

export const categoryResult = (snapshot: ChamberSnapshot) => ({ ...freshness(snapshot), categories: snapshot.categories });

export const eventSearchResult = (snapshot: ChamberSnapshot, query?: string, limit?: number) => ({
  ...freshness(snapshot),
  results: searchEvents(snapshot, query, limit).map(publicEvent),
});

export const eventResult = (snapshot: ChamberSnapshot, id: string) => ({
  ...freshness(snapshot),
  event: (() => {
    const event = snapshot.events.find((entry) => entry.id === id || entry.sourceUrl.endsWith(id));
    return event ? publicEvent(event) : null;
  })(),
});

export const benefitSearchResult = (snapshot: ChamberSnapshot, query?: string, limit?: number) => ({
  ...freshness(snapshot),
  results: searchResources(snapshot.benefits, query, limit).map(publicResource),
});

export const dealSearchResult = (snapshot: ChamberSnapshot, query?: string, limit?: number) => ({
  ...freshness(snapshot),
  results: searchResources(snapshot.deals, query, limit).map(publicResource),
});

export const statusResult = (snapshot: ChamberSnapshot) => ({
  snapshotDate: snapshot.snapshotId,
  crawlDate: snapshot.generatedAt,
  memberCount: snapshot.stats.members,
  categoryCount: snapshot.stats.categories,
  eventCount: snapshot.stats.events,
  benefitCount: snapshot.benefits.length,
  dealCount: snapshot.deals.length,
  source: snapshot.source,
  schemaVersion: snapshot.schemaVersion,
});
