import type { ChamberEvent, ChamberMember, ChamberResource, ChamberSnapshot } from "./schema.js";

const SYNONYMS: Record<string, string[]> = {
  accountant: ["accounting", "bookkeeping", "bookkeeper", "tax"],
  "commercial insurance": ["insurance", "business insurance", "broker"],
  photographer: ["photography", "photo", "media"],
  "someone who can make a sign": ["sign", "signage", "printing", "graphic design"],
  "it company": ["computer", "technology", "it support", "cybersecurity", "telecommunications"],
  restaurant: ["restaurant", "cafe", "food", "catering", "bakery"],
  "marketing agency": ["marketing", "advertising", "branding", "public relations", "social media"],
  "employee benefits": ["benefits", "insurance", "human resources", "financial"],
};

const normalize = (value: string): string => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const tokens = (value: string): string[] => normalize(value).split(/\s+/).filter((token) => token.length > 1);

const editDistance = (a: string, b: string): number => {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const saved = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = saved;
    }
  }
  return row[b.length];
};

const scoreText = (query: string, fields: Array<[string | undefined, number]>): number => {
  if (!query.trim()) return 1;
  const normalizedQuery = normalize(query);
  const expanded = uniqueTerms([normalizedQuery, ...(SYNONYMS[normalizedQuery] ?? []), ...tokens(query)]);
  let score = 0;
  for (const [field, weight] of fields) {
    const haystack = normalize(field ?? "");
    if (!haystack) continue;
    if (haystack === normalizedQuery) score += 100 * weight;
    if (haystack.includes(normalizedQuery)) score += 25 * weight;
    const words = haystack.split(" ");
    for (const term of expanded) {
      if (words.includes(term)) score += 5 * weight;
      else if (term.length >= 5 && words.some((word) => word.length >= 4 && (word.startsWith(term) || term.startsWith(word)))) score += 3 * weight;
      else if (term.length >= 5 && words.some((word) => Math.abs(word.length - term.length) <= 2 && editDistance(term, word) <= Math.max(1, Math.ceil(term.length / 4)))) score += 1.5 * weight;
    }
  }
  return score;
};

const uniqueTerms = (values: string[]): string[] => [...new Set(values.flatMap(tokens))];

export type MemberSearch = { query?: string; category?: string | null; city?: string | null; limit?: number };

export const searchMembers = (snapshot: ChamberSnapshot, input: MemberSearch): ChamberMember[] => {
  const category = normalize(input.category ?? "");
  const city = normalize(input.city ?? "");
  return snapshot.members
    .filter((member) => !category || member.categories.some((value) => normalize(value).includes(category)))
    .filter((member) => !city || normalize(member.address?.city ?? "").includes(city))
    .map((member) => ({ member, score: scoreText(input.query ?? "", [
      [member.name, 4],
      [member.categories.join(" "), 3],
      [member.shortDescription, 2],
      [member.description, 1.5],
      [member.address?.city, 1],
    ]) }))
    .filter(({ score }) => !(input.query ?? "").trim() || score > 0)
    .sort((a, b) => b.score - a.score || a.member.name.localeCompare(b.member.name))
    .slice(0, Math.min(Math.max(input.limit ?? 10, 1), 25))
    .map(({ member }) => member);
};

export const searchEvents = (snapshot: ChamberSnapshot, query = "", limit = 10): ChamberEvent[] => snapshot.events
  .map((event) => ({ event, score: scoreText(query, [[event.title, 4], [event.categories?.join(" "), 2], [event.description, 1], [event.venue, 1]]) }))
  .filter(({ score }) => !query.trim() || score > 0)
  .sort((a, b) => b.score - a.score || (a.event.startAt ?? "").localeCompare(b.event.startAt ?? ""))
  .slice(0, Math.min(Math.max(limit, 1), 25))
  .map(({ event }) => event);

export const searchResources = (resources: ChamberResource[], query = "", limit = 10): ChamberResource[] => resources
  .map((resource) => ({ resource, score: scoreText(query, [[resource.title, 4], [resource.description, 2], [resource.businessName, 2]]) }))
  .filter(({ score }) => !query.trim() || score > 0)
  .sort((a, b) => b.score - a.score || a.resource.title.localeCompare(b.resource.title))
  .slice(0, Math.min(Math.max(limit, 1), 25))
  .map(({ resource }) => resource);
