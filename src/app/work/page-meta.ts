import { siteConfig } from "@/data/site";

/** Shared by page.tsx (metadata.description) and opengraph-image.tsx (OG
 *  subtitle) — kept in its own module, separate from page.tsx, so the OG
 *  image route doesn't pull in the page's full component tree. */
export const workDescription = `Websites designed and built by ${siteConfig.name} — real client work, from first build to ongoing care.`;
