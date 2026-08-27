"use client";

/**
 * REBUILD-SPEC.md step 8 — /work is websites only now. Campaigns and
 * Motion Design (and their filter) moved to /gallery; this component now
 * just owns the build-vs-care filter and hands it to ClientStories, which
 * does the actual filtering of its own Builds/Ongoing Care groups.
 */

import { useState } from "react";

import { Container } from "@/components/ui/container";
import { ClientStories } from "./client-stories";
import { WorkFilter, type WorkEngagementFilter } from "./work-filter";

export function WorkExperience() {
  const [active, setActive] = useState<WorkEngagementFilter>(null);

  return (
    <>
      <div className="py-comfortable">
        <Container>
          <WorkFilter active={active} onSelect={setActive} />
        </Container>
      </div>

      <ClientStories activeEngagement={active} />
    </>
  );
}
