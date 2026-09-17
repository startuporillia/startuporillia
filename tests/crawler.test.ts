import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { discoverMemberUrls, readEventPage, readMemberPage } from "../scripts/chamber/crawl";

let browser: Browser;
let page: Page;
const fixture = (name: string) => readFile(resolve("tests/fixtures", name), "utf8");

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage();
});

afterAll(async () => browser.close());

describe("saved GrowthZone page fixtures", () => {
  it("discovers and deduplicates member detail links", async () => {
    await page.setContent(await fixture("growthzone-directory.html"));
    expect(await discoverMemberUrls(page)).toEqual([
      "https://business.orillia.com/list/member/lake-country-signs-101",
      "https://business.orillia.com/list/member/orillia-tech-202",
    ]);
  });

  it("extracts and normalizes a member and categories", async () => {
    await page.setContent(await fixture("growthzone-member.html"));
    const member = await readMemberPage(page, "https://business.orillia.com/list/member/lake-country-signs-101");
    expect(member).toMatchObject({
      name: "Lake Country Signs",
      categories: ["Marketing", "Signs & Banners"],
      phone: "(705) 555-0199",
      email: "hello@example.test",
      website: "https://example.test/",
      address: { city: "Orillia", province: "ON" },
    });
    expect(member?.logoUrl).toBe("https://business.orillia.com/images/signs.png");
  });

  it("extracts an event, registration URL, and provenance", async () => {
    await page.setContent(await fixture("growthzone-event.html"));
    const event = await readEventPage(page, "https://business.orillia.com/events/details/business-after-five-303");
    expect(event).toMatchObject({
      title: "Business After Five",
      startAt: "2026-10-15T17:00:00-04:00",
      venue: "Orillia Public Library",
      categories: ["Networking"],
      registrationUrl: "https://business.orillia.com/events/register/303",
    });
  });
});
