import type { ComponentType } from "react";

import { ClientTrustStrip } from "./client-trust-strip";
import { CraftInMotion } from "./craft-in-motion";
import { FeaturedWork } from "./featured-work";
import { FromIdeaToImpact } from "./from-idea-to-impact";
import { Hero } from "./hero";
import { HomepageCta } from "./homepage-cta";
import { ServicesOverview } from "./services-overview";
import { WhatICanHelpYouBuild } from "./what-i-can-help-you-build";

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
 */
export const homepageSections: HomepageSection[] = [
  { id: "hero", component: Hero },
  { id: "services", component: ServicesOverview },
  { id: "featured-work", component: FeaturedWork },
  { id: "craft-in-motion", component: CraftInMotion },
  { id: "from-idea-to-impact", component: FromIdeaToImpact },
  { id: "what-i-can-help-you-build", component: WhatICanHelpYouBuild },
  { id: "client-trust-strip", component: ClientTrustStrip },
  { id: "homepage-cta", component: HomepageCta },
];
