"use client";

/**
 * A 1px full-width rule that reveals scaleX 0->1 from the left on enter
 * (0.9s expo.out) while its colour flashes --border -> --accent ->
 * --border across the same 0.9s, then settles. Built on useScrollScrub
 * (Step 2's shared scaffolding) rather than one-off ScrollTrigger setup —
 * `scrub: false`/`once: true` here just means "play once on enter," not
 * a continuous scrub; the hook's reduced-motion handling (falls back to
 * a static --border rule, no animation) comes for free.
 */

import { useRef } from "react";

import { useScrollScrub } from "@/hooks/use-scroll-scrub";
import { gsap } from "@/lib/gsap";

function readCssValue(variable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || fallback;
}

export function AccentLine() {
  const ruleRef = useRef<HTMLDivElement>(null);

  const scrubRef = useScrollScrub<HTMLDivElement>({
    scrub: false,
    build: (_container, baseVars) => {
      const rule = ruleRef.current;
      if (!rule) return;

      const border = readCssValue("--border", "#2b2924");
      const accent = readCssValue("--accent", "#a64f39");

      gsap.set(rule, { scaleX: 0, backgroundColor: border });

      const timeline = gsap.timeline({
        scrollTrigger: { ...baseVars, start: "top 90%", once: true },
      });

      timeline
        .to(rule, { scaleX: 1, duration: 0.9, ease: "expo.out" }, 0)
        .to(rule, { backgroundColor: accent, duration: 0.45, ease: "power1.inOut" }, 0)
        .to(rule, { backgroundColor: border, duration: 0.45, ease: "power1.inOut" }, 0.45);
    },
    reducedMotionFallback: () => {
      const rule = ruleRef.current;
      if (!rule) return;
      gsap.set(rule, { scaleX: 1, backgroundColor: readCssValue("--border", "#2b2924") });
    },
  });

  return (
    <div ref={scrubRef} aria-hidden="true" className="w-full">
      <div ref={ruleRef} className="h-px w-full origin-left" />
    </div>
  );
}
