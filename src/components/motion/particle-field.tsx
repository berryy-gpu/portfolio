"use client";

/**
 * A persistent, site-wide ambient particle layer — mounted once in
 * src/app/layout.tsx (inside <Providers>, alongside <Preloader />,
 * <PageTransition />, etc.), the same way SoundProvider and Navigation
 * are, so it never remounts/restarts across client-side TransitionLink
 * navigation.
 *
 * Fixed, full-viewport, pointer-events:none, at the shared zIndex.particles
 * token (see motion-tokens.ts for why it sits one level above the
 * persistent WebGL canvas). `interactivity.detectsOn: "window"` in
 * particles-config.ts is what makes pointer-events:none safe here — grab/
 * repulse listen on the window, not the canvas, so real clicks and
 * scrolls on actual page content pass straight through untouched.
 *
 * Gated the same way the site's other ambient/decorative systems are:
 *   - prefers-reduced-motion (useReducedMotion, same hook as sitewide):
 *     don't mount at all — cheapest possible response, matching the
 *     hero's WebGL scene (`showWebgl = webglSupported && !prefersReducedMotion`)
 *     and the sound system (fully silent under reduced motion).
 *   - Lowest quality tier OR a coarse (touch) pointer: mount, but with far
 *     fewer particles and hover/click interactivity turned off entirely —
 *     "grab on hover" has no meaning on a touchscreen, and a low-tier
 *     device shouldn't be paying for either the extra particles or the
 *     interactivity math.
 *
 * Dynamically imported with ssr:false below (same pattern hero.tsx uses
 * for HeroView) so @tsparticles/* — engine, slim, react — never lands in
 * the server bundle or the initial JS payload; it's a separate chunk
 * fetched only once a browser actually needs it.
 */

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useQualityTier } from "@/hooks/use-quality-tier";
import { particlesConfig } from "@/data/particles-config";
import { zIndex } from "@/lib/motion-tokens";
import type { ISourceOptions } from "@tsparticles/engine";

const ParticleFieldCanvas = dynamic(
  () => import("@/components/motion/particle-field-canvas").then((mod) => mod.ParticleFieldCanvas),
  { ssr: false }
);

const DEGRADED_PARTICLE_COUNT = 18;

// `interactivity` isn't part of @tsparticles/engine's own IOptions — it's
// added by the separate @tsparticles/plugin-interactivity package via
// declaration merging that this project doesn't depend on directly, so
// ISourceOptions types it as `unknown` via IOptions' index signature.
// This local shape only describes the handful of fields this component
// actually reads back out of particlesConfig.interactivity.
interface InteractivityEventsShape {
  detectsOn?: string;
  events?: {
    onHover?: { enable?: boolean; mode?: string };
    onClick?: { enable?: boolean; mode?: string };
  };
  modes?: Record<string, unknown>;
}

export function ParticleField() {
  const prefersReducedMotion = useReducedMotion();
  const tier = useQualityTier();
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  const isDegraded = tier === "low" || isCoarsePointer;

  const options = useMemo<ISourceOptions>(() => {
    if (!isDegraded) return particlesConfig;

    const baseInteractivity = particlesConfig.interactivity as InteractivityEventsShape | undefined;

    return {
      ...particlesConfig,
      particles: {
        ...particlesConfig.particles,
        number: {
          ...particlesConfig.particles?.number,
          value: DEGRADED_PARTICLE_COUNT,
        },
      },
      interactivity: {
        ...baseInteractivity,
        events: {
          ...baseInteractivity?.events,
          onHover: { enable: false },
          onClick: { enable: false },
        },
      },
    };
  }, [isDegraded]);

  if (prefersReducedMotion) return null;

  return (
    <ParticleFieldCanvas
      options={options}
      style={{ position: "fixed", inset: 0, zIndex: zIndex.particles, pointerEvents: "none" }}
    />
  );
}
