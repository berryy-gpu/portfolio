"use client";

/**
 * The "trygon" particle field — a second, independent tsParticles
 * instance mounted locally inside each Hero/CTA-type section (hero.tsx,
 * cta.tsx, services-hero.tsx, services-cta.tsx, about-cta.tsx,
 * client-hero.tsx), separate from the persistent site-wide field
 * (particle-field.tsx). Reuses the same ParticleFieldCanvas — no second
 * engine-wiring implementation — just a different config
 * (particles-trygon-config.ts) and `position: absolute` instead of
 * `fixed`, so it fills exactly its own section rather than the viewport.
 *
 * `id` is required, not defaulted: every mounted instance needs a
 * stable-but-unique id (see each call site) so tsParticles' internal DOM
 * registry never collides — between this field and the site-wide one,
 * or between two of these sections rendered on the same page (e.g. the
 * homepage's Hero and Cta both mounting a trygon field simultaneously).
 *
 * Gated the same way the site-wide field is (prefers-reduced-motion:
 * don't mount at all; lowest tier or a coarse pointer: fewer particles,
 * interactivity off) — this is a heavier config (a size-oscillation
 * animation plus permanent proximity lines) mounted into sections that
 * often already run a WebGL scene, GSAP entrance reveal, or a
 * backdrop-blur glass panel, so the same defensive posture applies at
 * least as much here as it does site-wide.
 */

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useQualityTier } from "@/hooks/use-quality-tier";
import { trygonParticlesConfig } from "@/data/particles-trygon-config";
import type { ISourceOptions } from "@tsparticles/engine";

const ParticleFieldCanvas = dynamic(
  () => import("@/components/motion/particle-field-canvas").then((mod) => mod.ParticleFieldCanvas),
  { ssr: false }
);

const DEGRADED_PARTICLE_COUNT = 4;

// Same rationale as particle-field.tsx's own copy of this shape — see
// that file's comment for why `interactivity` needs a local type here.
interface InteractivityEventsShape {
  detectsOn?: string;
  events?: {
    onHover?: { enable?: boolean; mode?: string };
    onClick?: { enable?: boolean; mode?: string };
  };
  modes?: Record<string, unknown>;
}

interface TrygonFieldProps {
  id: string;
}

export function TrygonField({ id }: TrygonFieldProps) {
  const prefersReducedMotion = useReducedMotion();
  const tier = useQualityTier();
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  const isDegraded = tier === "low" || isCoarsePointer;

  const options = useMemo<ISourceOptions>(() => {
    if (!isDegraded) return trygonParticlesConfig;

    const baseInteractivity = trygonParticlesConfig.interactivity as
      | InteractivityEventsShape
      | undefined;

    return {
      ...trygonParticlesConfig,
      particles: {
        ...trygonParticlesConfig.particles,
        number: {
          ...trygonParticlesConfig.particles?.number,
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
      id={id}
      options={options}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}
