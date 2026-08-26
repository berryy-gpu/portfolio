"use client";

/**
 * Services' cinematic intro — same bespoke big-type/staggered-entrance
 * pattern as WorkHeader/AboutStatement/ClientHero. The headline is the
 * literal question this page exists to answer.
 */

import { motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/ui/container";
import { easing } from "@/lib/motion-tokens";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easing.hero },
  },
};

export function ServicesHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-generous md:py-expansive">
      <Container>
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
            Services
          </motion.span>
          <motion.h1
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="font-heading text-display-xl tracking-display break-words text-text-primary"
          >
            How can I help your business?
          </motion.h1>
          <motion.p
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="text-body-lg text-text-secondary"
          >
            Six ways to work together, each built around a real problem
            rather than a line item.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
