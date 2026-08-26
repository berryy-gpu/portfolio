"use client";

/**
 * REBUILD-SPEC.md /work header: "SELECTED WORK" at display-xl with a
 * live count in mono — derived from getClientStories(), never hardcoded.
 */

import { motion, useReducedMotion } from "framer-motion";

import { getClientStories } from "@/data/work";
import { easing } from "@/lib/motion-tokens";

export function WorkHeader() {
  const prefersReducedMotion = useReducedMotion();
  const count = getClientStories().length;

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easing.hero }}
      className="flex flex-col gap-4"
    >
      <span className="font-mono text-caption tracking-caption text-text-secondary uppercase">
        {String(count).padStart(2, "0")} Projects
      </span>
      <h1 className="font-heading text-display-xl tracking-display text-text-primary">
        Selected Work
      </h1>
    </motion.div>
  );
}
