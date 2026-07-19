import { contactCta } from "./navigation";
import { siteConfig } from "./site";

export interface HomepageCtaConfig {
  message: string;
  cta: { label: string; href: string };
}

/**
 * The homepage's closing CTA. Composed entirely from already-approved
 * data — site.ts's tagline and navigation.ts's Contact link — rather
 * than new copy: a closing restatement of the Hero's own message,
 * paired with the site's one persistent conversion action.
 */
export const homepageCtaConfig: HomepageCtaConfig = {
  message: siteConfig.tagline ?? "",
  cta: { label: contactCta.label, href: contactCta.href },
};
