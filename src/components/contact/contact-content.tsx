"use client";

/**
 * REBUILD-SPEC.md /contact: split layout, form left, large type right at
 * display-xl. One entrance animation (fade + rise), same as every other
 * page's intro, then nothing else moves — this page still deliberately
 * carries less atmosphere than the rest of the site.
 */

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { LiveClock } from "@/components/ui/live-clock";
import { useSound } from "@/components/providers/sound-provider";
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
  const { playClick, playHover } = useSound();
  const whatsappUrl = siteConfig.socialLinks.find((link) => link.label === "WhatsApp")?.url;

  if (!siteConfig.email) {
    return null;
  }

  return (
    <section className="flex min-h-[80vh] flex-col justify-center py-expansive">
      <Container>
        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={prefersReducedMotion ? undefined : containerVariants}
          className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center lg:gap-24"
        >
          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="min-w-0 rounded-lg border border-border bg-surface-elevated p-8 shadow-glass md:p-10"
          >
            <ContactForm />

            {whatsappUrl && (
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <span className="text-small text-text-secondary">
                  Or message me directly on
                </span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClick}
                  onPointerEnter={playHover}
                  className="group inline-flex items-center gap-1.5 text-small font-medium text-accent transition-colors hover:text-text-primary"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            )}
          </motion.div>

          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="flex min-w-0 flex-col gap-6 lg:order-first"
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-caption tracking-caption text-text-secondary uppercase">
                Contact
              </span>
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-success [animation-duration:3s]"
                />
                <span className="font-mono text-caption tracking-caption text-text-secondary uppercase">
                  Available for new work
                </span>
              </span>
              {siteConfig.location && (
                <LiveClock className="font-mono text-caption tracking-caption text-text-tertiary tabular-nums uppercase" />
              )}
            </div>
            <h1 className="font-heading text-display tracking-display text-text-primary break-words">
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
