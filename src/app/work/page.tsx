import type { Metadata } from "next";

import { Section } from "@/components/ui/section";
import { CursorSpotlight } from "@/components/work/cursor-spotlight";
import { WorkAmbientBackground } from "@/components/work/work-ambient-background";
import { WorkCta } from "@/components/work/work-cta";
import { WorkExperience } from "@/components/work/work-experience";
import { WorkHeader } from "@/components/work/work-header";

import { workDescription } from "./page-meta";

export const metadata: Metadata = {
  title: "Selected Work",
  description: workDescription,
};

export default function WorkPage() {
  return (
    <>
      <WorkAmbientBackground />
      <CursorSpotlight />
      <Section>
        <WorkHeader />
      </Section>
      <WorkExperience />
      <WorkCta />
    </>
  );
}
