"use client";

/**
 * The entire Contact page in one calm, centered block — no ambient
 * glow, no scroll-triggered reveals, deliberately less atmosphere than
 * every other page. "Zero distractions" meant treating restraint itself
 * as this page's personality rather than giving it its own mood layer.
 * One entrance animation (fade + rise), same as every other page's
 * intro, then nothing else moves.
 *
 * The actual submission (ContactForm) is a real form posting to
 * /api/contact — no mailto:, see contact-form.tsx.
 */

import { motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact/contact-form";
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

export function ContactContent() {
  const prefersReducedMotion = useReducedMotion();

  if (!siteConfig.email) {
    return null;
  }

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center py-expansive md:py-cinematic">
      <Container width="reading">
        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={prefersReducedMotion ? undefined : containerVariants}
          className="flex flex-col items-center gap-8 text-center"
        >
          <motion.span
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="text-caption tracking-caption text-text-secondary"
          >
            Contact
          </motion.span>

          <motion.h1
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="font-heading text-h1 tracking-heading break-words text-text-primary md:text-display"
          >
            Let&apos;s talk about your project.
          </motion.h1>

          <motion.p
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="text-body-lg text-text-secondary"
          >
            Tell me what you&apos;re building — I&apos;ll get back to you.
          </motion.p>

          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="flex w-full justify-center"
          >
            <ContactForm />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
