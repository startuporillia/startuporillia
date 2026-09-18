import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadSkills } from "./skills/catalog.js";
import { workshops } from "../src/lib/workshops.js";
import { getPageMetadata, SHARE_IMAGE, SITE_URL, type PageMetadata } from "../src/lib/page-metadata.js";

export const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function renderPageMetadata(template: string, page: PageMetadata) {
  const url = SITE_URL + page.path;
  const tags = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    ...Object.entries({ description: page.description, "twitter:card": "summary_large_image", "twitter:title": page.title, "twitter:description": page.description, "twitter:url": url, "twitter:image": SHARE_IMAGE, "twitter:image:alt": "Startup Orillia — a community of founders and builders" }).map(([name, content]) => `<meta name="${name}" content="${escapeHtml(content)}" />`),
    ...Object.entries({ "og:type": "website", "og:site_name": "Startup Orillia", "og:locale": "en_CA", "og:title": page.title, "og:description": page.description, "og:url": url, "og:image": SHARE_IMAGE, "og:image:type": "image/jpeg", "og:image:width": "1200", "og:image:height": "630", "og:image:alt": "Startup Orillia — a community of founders and builders" }).map(([property, content]) => `<meta property="${property}" content="${escapeHtml(content)}" />`),
  ].join("\n  ");
  return template.replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\b[^>]*(?:name|property)=["'](?:description|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi, "")
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, "")
    .replace("</head>", `  ${tags}\n</head>`);
}

export async function buildSocialMetadata() {
  const template = await readFile("dist/index.html", "utf8");
  const skills = (await loadSkills()).map((skill) => ({ slug: skill.name, ...skill.meta }));
  const pages = getPageMetadata(skills, workshops);
  for (const page of pages) {
    const file = page.path === "/" ? "dist/index.html" : `dist/share-pages${page.path}.html`;
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, renderPageMetadata(template, page));
  }
  await writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `  <url><loc>${escapeHtml(SITE_URL + page.path)}</loc></url>`).join("\n")}\n</urlset>\n`);
  console.log(`Generated HTML sharing metadata for ${pages.length} pages and an updated sitemap.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await buildSocialMetadata();
