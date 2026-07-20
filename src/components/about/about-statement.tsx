"use client";

/**
 * About's cinematic intro — same bespoke big-type/staggered-entrance
 * pattern as WorkHeader/ClientHero, so all three "personality" pages
 * share one visual language. Pairs the statement with the real profile
 * photo (siteConfig.avatar) — the only "large photography" asset that
 * actually exists, used once, prominently, rather than invented.
 */

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/ui/container";
import { aboutContent } from "@/data/about";
import { siteConfig } from "@/data/site";
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

export function AboutStatement() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-generous md:py-expansive">
      <Container>
        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={prefersReducedMotion ? undefined : containerVariants}
          className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16"
        >
          <div className="flex max-w-3xl flex-col gap-4">
            <motion.span
              variants={prefersReducedMotion ? undefined : itemVariants}
              className="text-caption tracking-caption text-text-secondary"
            >
              About
            </motion.span>
            <motion.h1
              variants={prefersReducedMotion ? undefined : itemVariants}
              className="font-heading text-h1 tracking-heading break-words text-text-primary md:text-display md:tracking-display"
            >
              {aboutContent.statement}
            </motion.h1>
          </div>

          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="shrink-0"
          >
            <Image
              src={siteConfig.avatar}
              alt={siteConfig.name}
              width={160}
              height={160}
              priority
              className="h-32 w-32 rounded-full border border-border object-cover md:h-40 md:w-40"
            />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
