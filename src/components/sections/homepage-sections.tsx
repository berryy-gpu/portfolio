import type { ComponentType } from "react";

import { Capabilities } from "./capabilities";
import { ClientMarquee } from "./client-marquee";
import { ClientsWorldwide } from "./clients-worldwide";
import { Cta } from "./cta";
import { FeaturedWork } from "./featured-work";
import { Hero } from "./hero";
import { Industries } from "./industries";
import { MotionReel } from "./motion-reel";
import { Process } from "./process";
import { Statement } from "./statement";
import { Stats } from "./stats";
import { Testimonials } from "./testimonials";

export interface HomepageSection {
  id: string;
  component: ComponentType;
}

/**
 * The homepage's section order, in one place. page.tsx renders this list
 * rather than importing and JSX-ing each section individually, so adding,
 * removing, or reordering a homepage section is a one-line change here
 * instead of an edit to the page itself.
 *
 * Each entry carries an explicit, stable id for React's key — component
 * function names (Component.name) aren't guaranteed unique or stable
 * (minification, HMR, refactors can all change them), so they're never
 * safe to use as a key.
 *
 * This is REBUILD-SPEC.md's complete 10-section homepage order (Footer,
 * section 11, is global chrome in layout.tsx, not here) — all of it now
 * built across Phases 6-8. featured-work is FROZEN (byte-identical to
 * before the rebuild); everything else here is new.
 */
export const homepageSections: HomepageSection[] = [
  { id: "hero", component: Hero },
  { id: "statement", component: Statement },
  { id: "client-marquee", component: ClientMarquee },
  { id: "featured-work", component: FeaturedWork },
  { id: "capabilities", component: Capabilities },
  { id: "industries", component: Industries },
  { id: "motion-reel", component: MotionReel },
  { id: "process", component: Process },
  { id: "stats", component: Stats },
  { id: "clients-worldwide", component: ClientsWorldwide },
  { id: "testimonials", component: Testimonials },
  { id: "cta", component: Cta },
];
