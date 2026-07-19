"use client";

/**
 * Orchestrates the filterable middle of the page: the quiet media-type
 * filter plus the two content sections it controls (Campaigns, Motion
 * Design). Explore Client Stories lives outside this — it's the closing
 * section, not filtered content, so it always shows.
 *
 * Each section owns its own Section wrapper/spacing/scroll-reveal;
 * this component only decides which are mounted and animates the
 * mount/unmount + reflow when the filter changes.
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

import { Container } from "@/components/ui/container";
import type { WorkMediaType } from "@/data/work";
import { duration, easing } from "@/lib/motion-tokens";
import { CampaignGallery } from "./campaign-gallery";
import { MotionDesignWall } from "./motion-design-wall";
import { WorkFilter } from "./work-filter";

export function WorkExperience() {
  const [active, setActive] = useState<WorkMediaType | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const sections: { key: WorkMediaType; node: ReactNode }[] = [
    { key: "campaigns", node: <CampaignGallery /> },
    { key: "motion", node: <MotionDesignWall /> },
  ];

  return (
    <>
      <div className="py-comfortable">
        <Container>
          <WorkFilter active={active} onSelect={setActive} />
        </Container>
      </div>

      <AnimatePresence mode="popLayout">
        {sections
          .filter(({ key }) => !active || active === key)
          .map(({ key, node }) => (
            <motion.div
              key={key}
              layout={!prefersReducedMotion}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: duration.normal, ease: easing.standard }}
            >
              {node}
            </motion.div>
          ))}
      </AnimatePresence>
    </>
  );
}
