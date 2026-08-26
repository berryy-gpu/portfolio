"use client";

/**
 * REBUILD-SPEC.md section 02 — after the Hero, the site goes quiet. One
 * statement pinned ~150vh; each word transitions --text-tertiary ->
 * --text-primary as scroll carries it past. The `scrubHighlight` grammar
 * (reveal-presets.ts), scrub: 1. No 3D, nothing else moving at the same
 * time as the Hero's WebGL — "one moving thing at a time."
 */

import { useRef } from "react";

import { Container } from "@/components/ui/container";
import { manifesto } from "@/data/manifesto";
import { useScrollScrub } from "@/hooks/use-scroll-scrub";
import { gsap, SplitText } from "@/lib/gsap";

function readCssColor(variable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || fallback;
}

export function Statement() {
  const textRef = useRef<HTMLParagraphElement>(null);

  const containerRef = useScrollScrub<HTMLDivElement>({
    start: "top top",
    end: "+=150%",
    scrub: true,
    pin: true,
    build: (_container, baseVars) => {
      const text = textRef.current;
      if (!text) return;

      const tertiary = readCssColor("--text-tertiary", "#6e6b63");
      const primary = readCssColor("--text-primary", "#f5f3ee");

      const split = SplitText.create(text, { type: "words" });
      gsap.set(split.words, { color: tertiary });

      gsap.to(split.words, {
        color: primary,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: { ...baseVars, scrub: 1 },
      });
    },
    reducedMotionFallback: () => {
      const text = textRef.current;
      if (text) gsap.set(text, { color: readCssColor("--text-primary", "#f5f3ee") });
    },
  });

  return (
    <section
      ref={containerRef}
      className="flex min-h-screen items-center"
    >
      <Container width="reading">
        <p ref={textRef} className="font-heading text-h1 leading-snug">
          {manifesto.statement}
        </p>
      </Container>
    </section>
  );
}
