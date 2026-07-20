"use client";

/**
 * Per-client atmosphere — the same glow-blob technique built for the
 * Work page (two static `filter: blur()` ellipses, GSAP scroll-scrub
 * parallax, `will-change-transform` so the browser composites instead
 * of repainting the blur on every frame — that repaint-without-
 * will-change combination was a confirmed cause of a real scroll-freeze
 * bug on the Work page). Kept as its own component rather than a shared
 * import from work-ambient-background.tsx so nothing about that
 * already-shipped page is touched; the technique is duplicated on
 * purpose, once, in a single small file.
 *
 * `color` is a plain CSS color string (client atmosphere accents live
 * in src/data/client-atmosphere.ts) rather than a Tailwind class, since
 * these are per-client dynamic values outside the design token scale.
 */

import { useRef } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { gsap } from "@/lib/gsap";

interface ClientAmbientGlowProps {
  color: string;
}

export function ClientAmbientGlow({ color }: ClientAmbientGlowProps) {
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
        style={{ backgroundColor: color, opacity: 0.08 }}
        className="absolute -top-40 left-[8%] h-[26rem] w-[38rem] -rotate-6 rounded-[50%] blur-3xl will-change-transform"
      />
      <div
        ref={blobTwoRef}
        style={{ backgroundColor: color, opacity: 0.05 }}
        className="absolute top-[45%] -right-24 hidden h-[22rem] w-[30rem] rotate-12 rounded-[50%] blur-3xl will-change-transform lg:block"
      />
    </div>
  );
}
