"use client";

/**
 * Page-wide atmosphere for /work — layered on purpose, not a flat
 * background: two slow-drifting glow ellipses (CSS `filter: blur()`,
 * unrelated to the reserved `--blur-functional` backdrop-blur token)
 * and a static film-grain texture for depth. All static/idle elements;
 * the only continuous motion is the glow parallax (GSAP ScrollTrigger,
 * scrub), gated behind prefers-reduced-motion.
 *
 * A WebGL particle field (drei Sparkles) used to render here too. It
 * was removed after diagnosing a real scroll-freeze/jump bug: it ran
 * its own per-frame render loop, and this project's Lenis/GSAP wiring
 * (smooth-scroller.tsx) runs with `gsap.ticker.lagSmoothing(0)` — no
 * compensation for a dropped frame. A GPU stall on that canvas (observed
 * directly — "GPU stall due to ReadPixels" in the console) stalls the
 * same ticker driving Lenis's scroll interpolation, which is exactly
 * the "stops, then snaps back" signature that was reported. Everything
 * else here is cheap CSS, not implicated, and stays.
 *
 * Deliberately NOT included, and why: an animated/looping noise texture
 * (redraws every frame for a barely-perceptible gain — the static grain
 * gives the same depth for near-zero cost) and a moving grid overlay
 * (risked reading as busy/technical rather than atmospheric).
 */

import { useRef } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { gsap } from "@/lib/gsap";

const NOISE_BACKGROUND =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function WorkAmbientBackground() {
  const blobOneRef = useRef<HTMLDivElement>(null);
  const blobTwoRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };
      if (reduceMotion) return;

      gsap.to(blobOneRef.current, {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      gsap.to(blobTwoRef.current, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <div
        ref={blobOneRef}
        className="absolute -top-40 left-[8%] h-[26rem] w-[38rem] -rotate-6 rounded-[50%] bg-accent/[0.06] blur-3xl will-change-transform"
      />
      <div
        ref={blobTwoRef}
        className="absolute top-[45%] -right-24 hidden h-[22rem] w-[30rem] rotate-12 rounded-[50%] bg-accent/[0.04] blur-3xl will-change-transform lg:block"
      />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: NOISE_BACKGROUND }}
      />
    </div>
  );
}
