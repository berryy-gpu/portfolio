import { siteConfig } from "@/data/site";

/** Shared by page.tsx (metadata.description) and opengraph-image.tsx (OG
 *  subtitle) — kept in its own module, separate from page.tsx, so the OG
 *  image route doesn't pull in the page's full component tree. */
export const contactDescription = `Get in touch with ${siteConfig.name}.`;
