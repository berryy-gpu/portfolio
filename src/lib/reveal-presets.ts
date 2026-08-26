import { duration, gsapEasing } from "./motion-tokens";

/**
 * The site's named motion grammars (REBUILD-SPEC.md "Motion vocabulary").
 * Each preset is a distinct reveal mechanic, not a variation on the same
 * fade-up — that's the whole point: no two adjacent homepage sections may
 * use the same one. This file holds each grammar's canonical timing/easing
 * so every component that implements a preset (SplitTextReveal, RevealImage,
 * useScrollReveal, useScrollScrub, Marquee, …) pulls from one place instead
 * of re-tuning the same feel five times.
 */
export type RevealPreset =
  | "maskUp"
  | "charCascade"
  | "clipReveal"
  | "scrubHighlight"
  | "horizontalPin"
  | "counterUp"
  | "settle";

interface RevealPresetConfig {
  /** Framer-style duration in seconds. */
  duration: number;
  /** GSAP-native ease name (see motion-tokens.ts gsapEasing). */
  ease: string;
  /** Per-item stagger in seconds, where the preset staggers multiple items. */
  stagger?: number;
  /** ScrollTrigger `scrub` value, for scroll-scrubbed presets only. */
  scrub?: boolean | number;
  /** Distance/scale knobs specific to a preset's mechanic. */
  yPercent?: number;
  scaleFrom?: number;
}

export const revealPresets: Record<RevealPreset, RevealPresetConfig> = {
  // Headlines: a line rises out of an overflow-hidden mask. Hero uses this
  // per-line at 0.08s apart per REBUILD-SPEC.md's Hero layout section.
  maskUp: {
    duration: 1.1,
    ease: gsapEasing.hero,
    stagger: 0.08,
    yPercent: 100,
  },
  // Hero-only: per-character stagger, 0.012s apart per spec.
  charCascade: {
    duration: 0.5,
    ease: gsapEasing.hero,
    stagger: 0.012,
  },
  // Images: clip-path inset wipe while the image counter-scales in from
  // 1.1x so it settles rather than "arriving".
  clipReveal: {
    duration: duration.cinematic,
    ease: gsapEasing.entrance,
    scaleFrom: 1.1,
  },
  // The Statement section's word-by-word tertiary -> primary color scrub,
  // tied 1:1 to scroll position.
  scrubHighlight: {
    duration: duration.normal,
    ease: gsapEasing.standard,
    scrub: 1,
  },
  // The Motion Reel's pinned horizontal translate.
  horizontalPin: {
    duration: duration.cinematic,
    ease: gsapEasing.standard,
    scrub: true,
  },
  // Stats: numbers counting from 0.
  counterUp: {
    duration: duration.slow,
    ease: gsapEasing.standard,
  },
  // The gentle fade-up the rest of the site used to lean on everywhere —
  // now deliberately rare (Process, Footer only). Mirrors useScrollReveal's
  // pre-existing defaults so it reads as the same "old" motion on purpose.
  settle: {
    duration: duration.slow,
    ease: gsapEasing.entrance,
    stagger: 0.1,
    yPercent: 24,
  },
};
