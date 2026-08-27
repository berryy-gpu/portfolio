"use client";

/**
 * Filter pills with a Framer layoutId indicator sliding between them —
 * REBUILD-SPEC.md's /work spec. Step 8 replaced the old media-type filter
 * (Campaigns/Motion moved to /gallery) with a build-vs-care filter over
 * the real `engagement` field, since /work is websites only now.
 */

import { motion, useReducedMotion } from "framer-motion";

import type { Project } from "@/data/projects";
import { duration, easing } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

export type WorkEngagementFilter = Project["engagement"] | null;

interface WorkFilterOption {
  id: WorkEngagementFilter;
  label: string;
}

const options: WorkFilterOption[] = [
  { id: null, label: "All" },
  { id: "build", label: "Built from scratch" },
  { id: "care", label: "Ongoing care" },
];

interface WorkFilterProps {
  active: WorkEngagementFilter;
  onSelect: (type: WorkEngagementFilter) => void;
}

export function WorkFilter({ active, onSelect }: WorkFilterProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      role="group"
      aria-label="Filter Work sections"
      className="inline-flex w-fit gap-1 rounded-pill border border-border bg-surface p-1"
    >
      {options.map((option) => {
        const isActive = active === option.id;

        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onSelect(option.id)}
            aria-pressed={isActive}
            className={cn(
              "relative rounded-pill px-4 py-2 text-small tracking-caption transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive ? "text-primary-foreground" : "text-text-secondary hover:text-text-primary"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="work-filter-indicator"
                className="absolute inset-0 -z-10 rounded-pill bg-accent"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: duration.normal, ease: easing.standard }
                }
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
