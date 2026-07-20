/**
 * The site's canonical absolute URL — used for metadataBase, the
 * sitemap, robots.txt, and JSON-LD. No production domain exists yet,
 * so this reads NEXT_PUBLIC_SITE_URL and falls back to localhost
 * rather than hardcoding a guessed domain. Set the real value in the
 * deployment host's environment variables once one is known.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
