import type { ProfileImagePath } from "./assets";
import { siteConfig } from "./site";

/**
 * Dedicated Hero data, organized by concern rather than as a flat object,
 * so future fields (Sprint 2+) have an obvious, scalable place to go
 * instead of accumulating loosely at the top level.
 *
 * Identity and Content compose values that already live in site.ts
 * (single source of truth — name/avatar/tagline are real site-wide
 * identity, not duplicated here) and simply present them in the shape
 * the Hero actually consumes.
 */

export interface HeroIdentity {
  name: string;
  avatar: ProfileImagePath;
}

export interface HeroContent {
  tagline: string;
  /**
   * A longer supporting line below the tagline — Hero-specific copy, not
   * sourced from `siteConfig` like `tagline` is, since it's too long for
   * the page `<title>`/meta description/OG subtitle that `siteConfig.tagline`
   * also feeds (see layout.tsx, opengraph-image.tsx).
   */
  description: string;
}

export interface HeroCta {
  label: string;
  href: string;
}

/**
 * Reserved for future Hero-specific media (e.g. a video variant of the
 * signature moment, a poster frame). Intentionally empty — nothing here
 * is approved content yet, and nothing should be invented to fill it.
 */
export interface HeroMedia {
  video?: string;
  poster?: string;
}

export interface HeroConfig {
  identity: HeroIdentity;
  content: HeroContent;
  cta: HeroCta;
  media: HeroMedia;
  /**
   * No approved scroll-cue copy exists yet (Content Architecture defines
   * the Hero's scroll cue as a purely visual affordance, not text) — left
   * unset rather than invented. If real copy is ever approved, the Hero
   * renders it automatically.
   */
  scrollCueLabel?: string;
}

export const heroConfig: HeroConfig = {
  identity: {
    name: siteConfig.name,
    avatar: siteConfig.avatar,
  },
  content: {
    tagline: siteConfig.tagline ?? "",
    description:
      "I craft refined digital experiences for ambitious brands ready to lead, not follow. Blending thoughtful design, strategic thinking, and modern technology, I build digital foundations that elevate perception, create meaningful connections, and turn attention into lasting growth.",
  },
  cta: {
    label: "View Work",
    href: "/work",
  },
  media: {},
};
