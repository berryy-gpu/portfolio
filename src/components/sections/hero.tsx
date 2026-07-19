"use client";

/**
 * The site's signature Hero — the homepage's opening scene.
 *
 * Implements the approved Master Design Specification: one coordinated
 * entrance (byline → headline → CTA) using the Hero/Cinematic motion
 * tokens, and the site's single sanctioned Three.js moment (Motion System
 * §11 — Minimal usage). This is intentionally the only significant 3D
 * interaction anywhere on the site.
 *
 * Do not add further Hero animations, effects, or a second 3D moment
 * without first revisiting the approved Motion System and Visual Identity
 * System — "Bold" is deliberately concentrated here, not distributed
 * across the rest of the site.
 *
 * Pure presentation only — all content comes from src/data/hero.ts, which
 * composes shared identity fields from site.ts rather than duplicating
 * them.
 */

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useMediaQuery } from "@/hooks/use-media-query";
import { heroConfig } from "@/data/hero";
import { easing } from "@/lib/motion-tokens";

const HeroScene = dynamic(
  () => import("@/components/three/hero-scene").then((mod) => mod.HeroScene),
  { ssr: false }
);

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
};

const bylineVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing.hero },
  },
};

const wordVariants = {
  hidden: { y: "100%" },
  visible: {
    y: "0%",
    transition: { duration: 0.6, ease: easing.hero },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing.hero },
  },
};

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const showScene = isDesktop && !prefersReducedMotion;

  const words = heroConfig.content.tagline.split(" ").filter(Boolean);

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
      {showScene && (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <HeroScene />
        </div>
      )}

      <Container className="relative z-10">
        <motion.div
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={prefersReducedMotion ? undefined : containerVariants}
          className="flex max-w-4xl flex-col gap-8"
        >
          <motion.div
            variants={prefersReducedMotion ? undefined : bylineVariants}
            className="flex items-center gap-3"
          >
            <Image
              src={heroConfig.identity.avatar}
              alt={heroConfig.identity.name}
              width={32}
              height={32}
              className="rounded-full"
              priority
            />
            <span className="text-small text-text-secondary">
              {heroConfig.identity.name}
            </span>
          </motion.div>

          <h1 className="font-heading text-h1 tracking-heading text-text-primary md:text-display md:tracking-display">
            {words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="inline-block overflow-hidden pb-1 align-bottom"
              >
                <motion.span
                  variants={prefersReducedMotion ? undefined : wordVariants}
                  className="inline-block"
                >
                  {word}
                  {index < words.length - 1 ? " " : ""}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            variants={prefersReducedMotion ? undefined : ctaVariants}
            className="flex items-center gap-6"
          >
            <Link
              href={heroConfig.cta.href}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              {heroConfig.cta.label}
            </Link>
          </motion.div>
        </motion.div>
      </Container>

      <div aria-hidden="true" className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        {heroConfig.scrollCueLabel ? (
          <span className="text-caption tracking-caption text-text-secondary">
            {heroConfig.scrollCueLabel}
          </span>
        ) : (
          <div className="h-10 w-px bg-border" />
        )}
      </div>
    </section>
  );
}
