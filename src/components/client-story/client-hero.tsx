"use client";

/**
 * The Client Story's cinematic intro — same bespoke big-type/staggered-
 * entrance pattern as the Work page's WorkHeader, so both "discovery"
 * pages share a visual language, adapted here with the client's name as
 * the dominant element and their real domain/services as supporting
 * facts, not marketing copy.
 */

import { motion, useReducedMotion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getCategoryById } from "@/data/categories";
import type { ClientStoryDetail } from "@/data/client-story";
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

interface ClientHeroProps {
  story: ClientStoryDetail;
}

export function ClientHero({ story }: ClientHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const domain = story.project?.websitePreview?.domain;

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
            {story.atmosphere.mood}
          </motion.span>

          <motion.h1
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="font-heading text-h1 tracking-heading break-words text-text-primary md:text-display md:tracking-display"
          >
            {story.client.name}
          </motion.h1>

          {domain && (
            <motion.span
              variants={prefersReducedMotion ? undefined : itemVariants}
              className="font-mono text-small text-text-secondary"
            >
              {domain}
            </motion.span>
          )}

          {story.categoryIds.length > 0 && (
            <motion.div
              variants={prefersReducedMotion ? undefined : itemVariants}
              className="flex flex-wrap gap-2 pt-2"
            >
              {story.categoryIds.map((categoryId) => {
                const category = getCategoryById(categoryId);
                if (!category) return null;
                return <Badge key={categoryId}>{category.label}</Badge>;
              })}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
