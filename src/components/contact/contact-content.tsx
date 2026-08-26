"use client";

/**
 * REBUILD-SPEC.md /contact: split layout, form left, large type right at
 * display-xl. One entrance animation (fade + rise), same as every other
 * page's intro, then nothing else moves — this page still deliberately
 * carries less atmosphere than the rest of the site.
 */

import { motion, useReducedMotion } from "framer-motion";

import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
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
    <section className="flex min-h-[80vh] flex-col justify-center py-expansive md:py-cinematic">
      <Container>
        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={prefersReducedMotion ? undefined : containerVariants}
          className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center lg:gap-24"
        >
          <motion.div variants={prefersReducedMotion ? undefined : itemVariants}>
            <ContactForm />
          </motion.div>

          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="flex flex-col gap-6 lg:order-first"
          >
            <span className="font-mono text-caption tracking-caption text-text-secondary uppercase">
              Contact
            </span>
            <h1 className="font-heading text-display-xl tracking-display text-text-primary break-words">
              Let&apos;s talk about your project.
            </h1>
            <p className="max-w-md text-body-lg text-text-secondary">
              Tell me what you&apos;re building — I&apos;ll get back to you.
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
