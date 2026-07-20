import type { Metadata } from "next";

import { Section } from "@/components/ui/section";
import { ClientStories } from "@/components/work/client-stories";
import { CursorSpotlight } from "@/components/work/cursor-spotlight";
import { WorkAmbientBackground } from "@/components/work/work-ambient-background";
import { WorkExperience } from "@/components/work/work-experience";
import { WorkHeader } from "@/components/work/work-header";

import { workDescription } from "./page-meta";

export const metadata: Metadata = {
  title: "Creative Showcase",
  description: workDescription,
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
