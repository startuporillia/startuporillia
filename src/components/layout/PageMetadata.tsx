import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageMetadata, SITE_URL } from "@/lib/page-metadata";
import { skills } from "@/lib/skills";
import { workshops } from "@/lib/workshops";

const pages = getPageMetadata(skills, workshops);

// Crawlers get build-time tags; keep browser tabs and tags correct on SPA navigation too.
export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.replace(/\/$/, "") || "/";
    const page = pages.find((entry) => entry.path === path);
    if (!page) { document.title = "Page not found | Startup Orillia"; return; }
    document.title = page.title;
    const values: Record<string, string> = { description: page.description, "og:title": page.title, "og:description": page.description, "og:url": SITE_URL + path, "twitter:title": page.title, "twitter:description": page.description, "twitter:url": SITE_URL + path };
    for (const [key, value] of Object.entries(values)) {
      document.querySelector(`meta[name="${key}"], meta[property="${key}"]`)?.setAttribute("content", value);
    }
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", SITE_URL + path);
  }, [pathname]);
  return null;
}
