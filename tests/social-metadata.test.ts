import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { renderPageMetadata } from "../scripts/social-metadata";
import { getPageMetadata, SITE_URL } from "../src/lib/page-metadata";
import { loadSkills } from "../scripts/skills/catalog";
import { workshops } from "../src/lib/workshops";

describe("page-specific link previews", () => {
  it("includes every main page, skill and workshop without duplicate paths", async () => {
    const skills = (await loadSkills()).map((skill) => ({ slug: skill.name, ...skill.meta }));
    const pages = getPageMetadata(skills, workshops);
    expect(pages).toHaveLength(8 + skills.length + workshops.length);
    expect(new Set(pages.map((page) => page.path)).size).toBe(pages.length);
    const template = await readFile("index.html", "utf8");
    for (const page of pages) {
      const html = renderPageMetadata(template, page);
      expect(html).toContain(`content="${SITE_URL}${page.path}"`);
      expect(html.match(/property="og:title"/g)).toHaveLength(1);
      expect(html.match(/name="twitter:title"/g)).toHaveLength(1);
      expect(html.match(/name="description"/g)).toHaveLength(1);
      expect(html.match(/rel="canonical"/g)).toHaveLength(1);
      expect(html).toContain('<div id="root"></div>');
    }
  });
  it("escapes content and retains application assets", () => {
    const html = renderPageMetadata('<head><title>Old</title></head><script src="/assets/app.js"></script>', { path: "/test", title: 'A & B <test> "title"', description: 'Do not inject "><script>bad</script>' });
    expect(html).toContain("A &amp; B &lt;test&gt; &quot;title&quot;");
    expect(html).not.toContain("<script>bad</script>");
    expect(html).toContain('src="/assets/app.js"');
  });
});
