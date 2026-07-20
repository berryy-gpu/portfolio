import { siteConfig } from "@/data/site";

/** Shared by page.tsx (metadata.description) and opengraph-image.tsx (OG
 *  subtitle) — kept in its own module, separate from page.tsx, so the OG
 *  image route doesn't pull in the page's full component tree. */
export const servicesDescription = `How ${siteConfig.name} can help your business — website design & development, creative campaigns, motion design, SEO, and automation.`;
