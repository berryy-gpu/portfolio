/**
 * Motion System tokens (Phase 5C.2 / 5C.3). Consumed directly by GSAP,
 * Framer Motion, and Lenis configuration — these are JS values, not CSS
 * classes, since animation timing lives in code, not stylesheets.
 */

export const duration = {
  instant: 0.12,
  fast: 0.25,
  normal: 0.5,
  slow: 0.85,
  cinematic: 1.6,
} as const;

export const easing = {
  standard: [0.4, 0, 0.2, 1],
  entrance: [0.22, 1, 0.36, 1],
  exit: [0.55, 0, 1, 0.45],
  hover: [0.25, 0.1, 0.25, 1],
  hero: [0.16, 1, 0.3, 1],
} as const;

/**
 * GSAP-native equivalents of the same five tokens. Framer Motion accepts
 * cubic-bezier arrays directly; GSAP's `ease` option needs a named ease
 * (or the CustomEase plugin) — these are the closest built-in matches to
 * each token's intent, not a literal conversion of the curves above.
 */
export const gsapEasing = {
  standard: "power2.inOut",
  entrance: "power3.out",
  exit: "power2.in",
  hover: "power1.out",
  hero: "expo.out",
} as const;

export const zIndex = {
  base: 0,
  elevated: 10,
  navigation: 100,
  cursor: 200,
  overlayScrim: 500,
  modal: 600,
  loading: 1000,
} as const;
