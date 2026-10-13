import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseSnapshot } from "../chamber/snapshot";
import { eventResult, eventSearchResult, memberResult, memberSearchResult } from "../chamber/tools";

const base = JSON.parse(await readFile(resolve("fixtures/chamber/synthetic-snapshot.json"), "utf8"));
base.members[0] = {
  ...base.members[0],
  phone: "(705) 555-1234",
  email: "owner@example.com",
  description: "Bread and pastries. Call 705-555-1234 or email orders@example.com to order.",
  shortDescription: "Call us at (705) 555 9876.",
};
base.events[0] = { ...base.events[0], description: "Questions? Contact events@example.com or 705.555.4321." };
const snapshot = parseSnapshot(base);

const PHONE = /\d{3}\D{0,2}\d{3}\D?\d{4}/;
const EMAIL = /@/;

describe("contact details are withheld from MCP results", () => {
  it("omits phone and email fields from a member record", () => {
    const { member } = memberResult(snapshot, "member-bakery");
    expect(member).not.toHaveProperty("phone");
    expect(member).not.toHaveProperty("email");
  });

  it("redacts phone numbers and emails inside member descriptions", () => {
    const text = JSON.stringify(memberResult(snapshot, "member-bakery").member);
    expect(text).not.toMatch(PHONE);
    expect(text).not.toMatch(EMAIL);
    expect(text).toContain("Bread and pastries.");
  });

  it("redacts contact details in member search results", () => {
    const text = JSON.stringify(memberSearchResult(snapshot, { query: "bakery", limit: 5 }).results);
    expect(text).not.toMatch(PHONE);
    expect(text).not.toMatch(EMAIL);
  });

  it("redacts contact details in event descriptions", () => {
    const one = JSON.stringify(eventResult(snapshot, "event-networking").event);
    const many = JSON.stringify(eventSearchResult(snapshot, "networking", 5).results);
    for (const text of [one, many]) {
      expect(text).not.toMatch(PHONE);
      expect(text).not.toMatch(EMAIL);
    }
  });
});
