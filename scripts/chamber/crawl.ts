import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, type BrowserContext, type Locator, type Page } from "playwright";
import { canonicalUrl, cleanText, normalizePhone, slugify, sourceIdFromUrl, stableId, uniqueSorted } from "../../chamber/normalize";
import { chamberSnapshotSchema, type ChamberEvent, type ChamberMember, type ChamberResource, type ChamberSnapshot } from "../../chamber/schema";

const BASE_URL = "https://business.orillia.com";
const DIRECTORY_URL = `${BASE_URL}/list/search?sa=true`;
const EVENT_URL = `${BASE_URL}/events/`;
const DEAL_URLS = [`${BASE_URL}/hotdeals`, `${BASE_URL}/membertomember`];
const OUTPUT = resolve(process.env.CHAMBER_SNAPSHOT_PATH ?? "fixtures/chamber/chamber-snapshot.local.json");
const USER_AGENT = "StartupOrillia-Chamber-Snapshot/1.0 (+https://startuporillia.ca/skills/connect)";
const THROTTLE_MS = Number(process.env.CHAMBER_CRAWL_THROTTLE_MS ?? 300);
const CONCURRENCY = Math.min(Math.max(Number(process.env.CHAMBER_CRAWL_CONCURRENCY ?? 3), 1), 5);

const wait = (ms: number) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
const optionalText = async (locator: Locator): Promise<string | null> => await locator.count() ? locator.first().textContent() : null;
const optionalAttribute = async (locator: Locator, name: string): Promise<string | null> => await locator.count() ? locator.first().getAttribute(name) : null;

async function gotoPublic(page: Page, url: string, readySelector: string): Promise<void> {
  await page.goto(url, { waitUntil: "commit", timeout: 60_000 });
  await page.locator(readySelector).first().waitFor({ state: "attached", timeout: 20_000 });
}

export async function readMemberPage(page: Page, sourceUrl: string): Promise<ChamberMember | null> {
  const addressLines = await page.locator("[itemprop='streetAddress']").allTextContents();
  const raw = {
    name: await page.locator("h1[itemprop='name'], h1.gz-pagetitle").first().textContent(),
    categories: await page.locator(".gz-details-categories .gz-cat, .gz-details-categories a").allTextContents(),
    line1: addressLines[0],
    line2: addressLines.slice(1).join(" "),
    city: await optionalText(page.locator("[itemprop='addressLocality']")),
    province: await optionalText(page.locator("[itemprop='addressRegion']")),
    postalCode: await optionalText(page.locator("[itemprop='postalCode']")),
    country: await optionalText(page.locator("[itemprop='addressCountry']")),
    phone: await optionalText(page.locator("[itemprop='telephone']")),
    email: (await optionalAttribute(page.locator(".gz-card-email a[href^='mailto:']"), "href"))?.replace(/^mailto:/i, "").split("?")[0],
    website: await optionalAttribute(page.locator(".gz-card-website a[href]"), "href"),
    description: await optionalText(page.locator(".gz-details-about [itemprop='description'], .gz-details-about")),
    hours: await optionalText(page.locator(".gz-details-hours, [itemprop='openingHours']")),
    logoUrl: await optionalAttribute(page.locator(".gz-details-logo img, [itemprop='logo'] img, img[itemprop='logo']"), "src"),
  };
  const name = cleanText(raw.name);
  const normalizedSource = canonicalUrl(sourceUrl, BASE_URL)!;
  if (!name) return null;
  const address = {
    line1: cleanText(raw.line1),
    line2: cleanText(raw.line2),
    city: cleanText(raw.city),
    province: cleanText(raw.province),
    postalCode: cleanText(raw.postalCode),
    country: cleanText(raw.country) ?? "Canada",
  };
  return {
    id: stableId(normalizedSource),
    sourceId: sourceIdFromUrl(normalizedSource),
    name,
    slug: slugify(name),
    description: cleanText(raw.description),
    categories: uniqueSorted(raw.categories.map(cleanText)),
    ...(Object.values(address).some(Boolean) ? { address } : {}),
    phone: normalizePhone(raw.phone),
    email: cleanText(raw.email)?.toLowerCase(),
    website: canonicalUrl(raw.website, normalizedSource),
    hours: cleanText(raw.hours),
    logoUrl: canonicalUrl(raw.logoUrl, normalizedSource),
    sourceUrl: normalizedSource,
  };
}

async function extractMember(page: Page, sourceUrl: string): Promise<ChamberMember | null> {
  await gotoPublic(page, sourceUrl, "h1[itemprop='name'], h1.gz-pagetitle");
  return readMemberPage(page, sourceUrl);
}

export const discoverMemberUrls = async (page: Page): Promise<string[]> => uniqueSorted(
  await page.locator("h5.gz-card-title a[href*='/list/member/']").evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href)),
);

async function crawlMembers(context: BrowserContext): Promise<ChamberMember[]> {
  const index = await context.newPage();
  await gotoPublic(index, DIRECTORY_URL, "h5.gz-card-title a[href*='/list/member/']");
  const urls = await discoverMemberUrls(index);
  await index.close();
  if (urls.length < 25) throw new Error(`Directory traversal found only ${urls.length} member URLs`);

  const members: ChamberMember[] = [];
  let cursor = 0;
  let completed = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    const page = await context.newPage();
    while (cursor < urls.length) {
      const url = urls[cursor++];
      const member = await extractMember(page, url).catch((error) => {
        console.warn(`Member extraction failed for ${url}:`, error instanceof Error ? error.message : error);
        return null;
      });
      if (member) members.push(member);
      completed += 1;
      if (completed % 25 === 0 || completed === urls.length) console.log(`Members: ${completed}/${urls.length}`);
      await wait(THROTTLE_MS);
    }
    await page.close();
  });
  await Promise.all(workers);
  return [...new Map(members.map((member) => [member.id, member])).values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function readEventPage(page: Page, sourceUrl: string): Promise<ChamberEvent | null> {
  const location = page.locator(".gz-event-location").first();
  const venue = await optionalText(location.locator("[itemprop='name']"));
  const start = page.locator("[itemprop='startDate']").first();
  const end = page.locator("[itemprop='endDate']").first();
  const registration = page.getByRole("link", { name: /register|registration/i }).first();
  const raw = {
    title: await page.locator("h1[itemprop='name'], h1.gz-pagetitle").first().textContent(),
    description: await optionalText(page.locator(".gz-event-description [itemprop='about'], .gz-event-description")),
    startAt: await optionalAttribute(start, "content") ?? await optionalAttribute(start, "datetime") ?? await optionalText(start),
    endAt: await optionalAttribute(end, "content") ?? await optionalAttribute(end, "datetime"),
    venue,
    address: (await optionalText(location))?.replace(/^\s*Location\s*/i, "").replace(venue ?? "", ""),
    categories: await page.locator(".gz-event-details [class*='category-'] a, .gz-event-categories a").allTextContents(),
    registrationUrl: await optionalAttribute(registration, "href"),
  };
  const title = cleanText(raw.title);
  const normalizedSource = canonicalUrl(sourceUrl, BASE_URL)!;
  if (!title) return null;
  return {
    id: stableId(normalizedSource),
    title,
    description: cleanText(raw.description)?.replace(/^Description\s*/i, ""),
    startAt: cleanText(raw.startAt),
    endAt: cleanText(raw.endAt),
    venue: cleanText(raw.venue),
    address: cleanText(raw.address),
    categories: uniqueSorted(raw.categories.map(cleanText)),
    registrationUrl: canonicalUrl(raw.registrationUrl, normalizedSource),
    sourceUrl: normalizedSource,
  };
}

async function extractEvent(page: Page, sourceUrl: string): Promise<ChamberEvent | null> {
  await gotoPublic(page, sourceUrl, "h1[itemprop='name'], h1.gz-pagetitle");
  return readEventPage(page, sourceUrl);
}

async function crawlEvents(context: BrowserContext): Promise<ChamberEvent[]> {
  const index = await context.newPage();
  await gotoPublic(index, EVENT_URL, "a[href*='/events/details/']");
  const urls = uniqueSorted(await index.locator("a[href*='/events/details/']").evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href)));
  await index.close();
  const page = await context.newPage();
  const events: ChamberEvent[] = [];
  for (const [index, url] of urls.entries()) {
    const event = await extractEvent(page, url).catch(() => null);
    if (event) events.push(event);
    if ((index + 1) % 10 === 0 || index + 1 === urls.length) console.log(`Events: ${index + 1}/${urls.length}`);
    await wait(THROTTLE_MS);
  }
  await page.close();
  return [...new Map(events.map((event) => [event.id, event])).values()].sort((a, b) => (a.startAt ?? "").localeCompare(b.startAt ?? ""));
}

async function crawlDeals(context: BrowserContext): Promise<ChamberResource[]> {
  const deals: ChamberResource[] = [];
  const page = await context.newPage();
  for (const url of DEAL_URLS) {
    await gotoPublic(page, url, "[itemprop='mainContentOfPage'], .gz-pagecontent, h1");
    const cards = page.locator(".gz-card, .card");
    for (let index = 0; index < await cards.count(); index++) {
      const card = cards.nth(index);
      const titleLink = card.locator(".gz-card-title a, h5 a, h4 a").first();
      const item = {
        title: await optionalText(titleLink),
        description: await optionalText(card.locator(".card-text, .gz-description")),
        sourceUrl: await optionalAttribute(titleLink, "href"),
      };
      const title = cleanText(item.title);
      const sourceUrl = canonicalUrl(item.sourceUrl, url);
      if (!title || !sourceUrl) continue;
      deals.push({ id: stableId(sourceUrl), title, description: cleanText(item.description), sourceUrl });
    }
  }
  await page.close();
  return [...new Map(deals.map((deal) => [deal.id, deal])).values()];
}

export async function crawl(): Promise<ChamberSnapshot> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: USER_AGENT });
  await context.route(/\.(?:gif|jpe?g|png|webp|woff2?)(?:\?.*)?$/i, (route) => route.abort());
  try {
    const members = await crawlMembers(context);
    const events = await crawlEvents(context);
    const deals = await crawlDeals(context);
    const categories = uniqueSorted(members.flatMap((member) => member.categories));
    const generatedAt = new Date().toISOString();
    return chamberSnapshotSchema.parse({
      schemaVersion: 1,
      snapshotId: generatedAt.slice(0, 10),
      generatedAt,
      source: { organization: "Orillia & District Chamber of Commerce", platform: "GrowthZone", baseUrl: BASE_URL },
      stats: { members: members.length, categories: categories.length, events: events.length },
      members,
      categories,
      events,
      benefits: [],
      deals,
    });
  } finally {
    await context.close();
    await browser.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const snapshot = await crawl();
  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Wrote ${OUTPUT}`);
  console.log(`${snapshot.members.length} members, ${snapshot.categories.length} categories, ${snapshot.events.length} events, ${snapshot.deals.length} deals`);
}
