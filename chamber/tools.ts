import type { ChamberSnapshot } from "./schema.js";
import { searchEvents, searchMembers, searchResources, type MemberSearch } from "./search.js";

export const freshness = (snapshot: ChamberSnapshot) => ({
  snapshotDate: snapshot.snapshotId,
  crawlDate: snapshot.generatedAt,
  source: snapshot.source,
  notice: "Chamber membership is not an endorsement or quality rating. Business and event information is based on a periodically refreshed snapshot of publicly available Orillia & District Chamber of Commerce information. Visit the original Chamber listing for the latest official information.",
});

export const memberSearchResult = (snapshot: ChamberSnapshot, input: MemberSearch) => ({
  ...freshness(snapshot),
  results: searchMembers(snapshot, input).map((member) => ({
    id: member.id,
    name: member.name,
    description: member.shortDescription ?? member.description,
    categories: member.categories,
    city: member.address?.city,
    website: member.website,
    sourceUrl: member.sourceUrl,
  })),
});

export const memberResult = (snapshot: ChamberSnapshot, id: string) => ({
  ...freshness(snapshot),
  member: snapshot.members.find((member) => member.id === id || member.slug === id || member.sourceId === id) ?? null,
});

export const categoryResult = (snapshot: ChamberSnapshot) => ({ ...freshness(snapshot), categories: snapshot.categories });

export const eventSearchResult = (snapshot: ChamberSnapshot, query?: string, limit?: number) => ({
  ...freshness(snapshot),
  results: searchEvents(snapshot, query, limit),
});

export const eventResult = (snapshot: ChamberSnapshot, id: string) => ({
  ...freshness(snapshot),
  event: snapshot.events.find((event) => event.id === id || event.sourceUrl.endsWith(id)) ?? null,
});

export const benefitSearchResult = (snapshot: ChamberSnapshot, query?: string, limit?: number) => ({
  ...freshness(snapshot),
  results: searchResources(snapshot.benefits, query, limit),
});

export const dealSearchResult = (snapshot: ChamberSnapshot, query?: string, limit?: number) => ({
  ...freshness(snapshot),
  results: searchResources(snapshot.deals, query, limit),
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
