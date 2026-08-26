import type { Metadata } from "next";

import { AboutCta } from "@/components/about/about-cta";
import { AboutEnjoys } from "@/components/about/about-enjoys";
import { AboutPhilosophy } from "@/components/about/about-philosophy";
import { AboutStatement } from "@/components/about/about-statement";
import { AboutStory } from "@/components/about/about-story";
import { AboutTimeline } from "@/components/about/about-timeline";
import { AboutTools } from "@/components/about/about-tools";

import { aboutDescription } from "./page-meta";

export const metadata: Metadata = {
  title: "About",
  description: aboutDescription,
};

/**
 * FIX 4 order — Tools moved directly after Story so the marquee breaks
 * up the text run instead of arriving after four consecutive text
 * sections: Statement -> Story -> Tools -> Timeline -> Philosophy ->
 * Enjoys -> CTA.
 */
export default function AboutPage() {
  return (
    <>
      <AboutStatement />
      <AboutStory />
      <AboutTools />
      <AboutTimeline />
      <AboutPhilosophy />
      <AboutEnjoys />
      <AboutCta />
    </>
  );
}
