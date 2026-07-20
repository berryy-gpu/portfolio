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

export default function AboutPage() {
  return (
    <>
      <AboutStatement />
      <AboutStory />
      <AboutTimeline />
      <AboutPhilosophy />
      <AboutEnjoys />
      <AboutTools />
      <AboutCta />
    </>
  );
}
