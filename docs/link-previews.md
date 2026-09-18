# Link previews

`npm run build` runs Vite, then `scripts/social-metadata.ts`. It copies the built application HTML for every supported page and replaces the title, description, canonical URL, Open Graph and Twitter tags. Vercel rewrites public page URLs to these static HTML files. Preview crawlers do not need JavaScript; browsers still load the same React application. `/mcp` and API routes are unchanged.

Main-page copy lives in `src/lib/page-metadata.ts`. Skill titles and descriptions come from catalog metadata, and workshop titles and descriptions come from the existing workshop catalog. The build also generates the sitemap. All pages use the existing 1200×630 JPEG banner, with absolute image URLs and image dimensions. No crawler-specific responses or new server are required.

When adding a top-level route, add it to the page metadata and Vercel rewrite. New skills and workshops are picked up automatically. Deploy after changing metadata. The browser also updates its title and tags during client-side navigation.

Verify deployed HTML with a normal HTTP GET (without executing JavaScript), checking that `og:title`, `og:description`, `og:url`, `og:image`, Twitter tags and canonical URL match the requested page. The image URL must return an image, not the SPA fallback. Test page loading and `/mcp` after routing changes.

Sharing apps cache previews. Existing shared messages may retain an older preview even after a successful deployment. This implementation supplies the metadata; individual apps control whether and when they display or refresh a card.
