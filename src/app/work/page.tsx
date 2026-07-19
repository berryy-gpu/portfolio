import type { Metadata } from "next";

import { Section } from "@/components/ui/section";
import { ClientStories } from "@/components/work/client-stories";
import { CursorSpotlight } from "@/components/work/cursor-spotlight";
import { WorkAmbientBackground } from "@/components/work/work-ambient-background";
import { WorkExperience } from "@/components/work/work-experience";
import { WorkHeader } from "@/components/work/work-header";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Creative Showcase — ${siteConfig.name}`,
  description: `Campaigns, motion design, and client stories by ${siteConfig.name} — the creative range behind the work.`,
};

export default function WorkPage() {
  return (
    <>
      <WorkAmbientBackground />
      <CursorSpotlight />
      <Section spacing="cinematic">
        <WorkHeader />
      </Section>
      <WorkExperience />
      <ClientStories />
    </>
  );
}
