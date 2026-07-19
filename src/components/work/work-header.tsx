"use client";

/**
 * The Work page's cinematic intro — oversized editorial type and a
 * staggered entrance, distinct from the standard homepage SectionHeader
 * (which every sub-section on this page still uses; only this top-level
 * intro gets the bespoke treatment).
 */

import { motion, useReducedMotion } from "framer-motion";

import { easing } from "@/lib/motion-tokens";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easing.hero },
  },
};

export function WorkHeader() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : "hidden"}
      animate="visible"
      variants={prefersReducedMotion ? undefined : containerVariants}
      className="flex max-w-4xl flex-col gap-4"
    >
      <motion.span
        variants={prefersReducedMotion ? undefined : itemVariants}
        className="text-caption tracking-caption text-text-secondary"
      >
        Work
      </motion.span>
      <motion.h1
        variants={prefersReducedMotion ? undefined : itemVariants}
        className="font-heading text-display tracking-display text-text-primary md:text-display-xl"
      >
        Creative Showcase
      </motion.h1>
      <motion.p
        variants={prefersReducedMotion ? undefined : itemVariants}
        className="text-body-lg text-text-secondary"
      >
        Campaigns, motion design, and the stories behind them.
      </motion.p>
    </motion.div>
  );
}
