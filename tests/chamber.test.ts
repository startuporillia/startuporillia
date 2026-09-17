import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { canonicalUrl, cleanText, normalizePhone, stableId, uniqueSorted } from "../chamber/normalize";
import { parseSnapshot, compareSnapshots } from "../chamber/snapshot";
import { searchEvents, searchMembers } from "../chamber/search";

const fixturePath = resolve("fixtures/chamber/synthetic-snapshot.json");
const fixture = parseSnapshot(JSON.parse(await readFile(fixturePath, "utf8")));

describe("snapshot schema and normalization", () => {
  it("validates the synthetic fixture and its counts", () => {
    expect(fixture.stats.members).toBe(5);
    expect(fixture.stats.events).toBe(2);
  });

  it("normalizes public data without losing meaning", () => {
    expect(cleanText("  hello\n  world ")).toBe("hello world");
    expect(normalizePhone("705.555.1234")).toBe("(705) 555-1234");
    expect(canonicalUrl("/list/member/test-1?utm_source=x#top", "https://business.orillia.com")).toBe("https://business.orillia.com/list/member/test-1");
    expect(uniqueSorted(["Photography", " photography ", "Advertising"])).toEqual(["Advertising", "Photography"]);
    expect(stableId("https://example.com/a")).toBe(stableId("https://example.com/a"));
  });
});

describe("snapshot sanity checks", () => {
  it("rejects an unexpectedly collapsed crawl", () => {
    const current = { ...fixture, stats: { ...fixture.stats, members: 1 }, members: fixture.members.slice(0, 1) };
    const diff = compareSnapshots(current, fixture);
    expect(diff.rejected).toBe(true);
    expect(diff.warnings).toContain("Member count fell by more than 25%");
  });

  it("reports additions, removals, and changes", () => {
    const changed = { ...fixture, members: fixture.members.map((member, index) => index === 0 ? { ...member, description: "Changed" } : member) };
    const diff = compareSnapshots(changed, fixture);
    expect(diff.changedMembers).toBe(1);
    expect(diff.rejected).toBe(false);
  });
});

describe("lexical and fuzzy search", () => {
  it.each([
    ["commercial photographer", "Example Commercial Photography"],
    ["someone who can make a sign", "Example Sign Studio"],
    ["IT company", "Example Technology Services"],
    ["accountant", "Example Accounting Office"],
    ["photografer", "Example Commercial Photography"],
  ])("matches %s", (query, expected) => {
    expect(searchMembers(fixture, { query, limit: 3 })[0]?.name).toBe(expected);
  });

  it("supports category and city filters", () => {
    expect(searchMembers(fixture, { query: "", category: "Cybersecurity", city: "Oro", limit: 5 })).toHaveLength(1);
  });

  it("returns no results for unrelated terms", () => {
    expect(searchMembers(fixture, { query: "deep sea submarine manufacturing" })).toHaveLength(0);
  });

  it("searches events and keeps provenance", () => {
    const events = searchEvents(fixture, "networking");
    expect(events[0]?.title).toContain("Business After Five");
    expect(events[0]?.sourceUrl).toMatch(/^https:\/\/business\.orillia\.com/);
  });
});
