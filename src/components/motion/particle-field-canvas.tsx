"use client";

/**
 * The actual tsParticles engine wiring — split out from particle-field.tsx
 * so that file can dynamically import this one with `ssr: false` (same
 * split as hero.tsx/hero-view.tsx), keeping `@tsparticles/*` entirely out
 * of the main bundle and off the server render.
 *
 * `ParticlesProvider`'s `init` callback must be referentially stable for
 * the lifetime of the app (its own docs/runtime enforce this — a changing
 * identity throws), so it's declared at module scope rather than inline.
 *
 * Pauses on `visibilitychange` exactly like sound-provider.tsx pauses its
 * AudioContext on a hidden tab — no reason to keep animating 77 particles
 * for a tab nobody is looking at.
 */

import { useEffect, useRef, type CSSProperties } from "react";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

async function initEngine(engine: Engine) {
  await loadSlim(engine);
}

interface ParticleFieldCanvasProps {
  options: ISourceOptions;
  style: CSSProperties;
}

export function ParticleFieldCanvas({ options, style }: ParticleFieldCanvasProps) {
  const containerRef = useRef<Container | undefined>(undefined);

  const handleLoaded = (container?: Container) => {
    containerRef.current = container;
    if (document.hidden) container?.pause();
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        containerRef.current?.pause();
      } else {
        containerRef.current?.play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <ParticlesProvider init={initEngine}>
      <Particles id="particle-field" options={options} style={style} particlesLoaded={handleLoaded} />
    </ParticlesProvider>
  );
}
