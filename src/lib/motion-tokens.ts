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
  /** The persistent WebGL canvas — deliberately negative, not 0, so it
   *  stacks behind ordinary in-flow page content by construction rather
   *  than relying on every section that might overlap it to remember to
   *  set its own z-index. See persistent-canvas.tsx. Sits one level below
   *  `particles` (both are fixed, full-viewport, pointer-events:none
   *  layers) so the ambient particle field reads above the graded-film
   *  backdrop shader rather than being painted over by it. */
  canvas: -2,
  /** The persistent ambient particle field (particle-field.tsx) — see
   *  `canvas` above for why this sits one level above it. Still behind
   *  `base`, so it never competes with real page content. */
  particles: -1,
  base: 0,
  elevated: 10,
  navigation: 100,
  /** Fixed scroll-progress bar (layout/scroll-progress.tsx) — above nav,
   *  below the transition overlay. Formerly `cursor`, orphaned when the
   *  custom-cursor system was removed; renamed rather than left dead or
   *  duplicated with a new token at the same numeric slot. */
  scrollProgress: 200,
  overlayScrim: 500,
  modal: 600,
  loading: 1000,
} as const;
