"use client";

/**
 * Ties an element's vertical position to scroll progress through its own
 * bounding box — the "counter-parallax" REBUILD-SPEC.md calls for on
 * case-study images. Transform-only (translateY via GSAP, never top), so
 * it stays compositor-driven inside the scroll loop per the performance
 * budget. Built on useScrollScrub, which handles prefers-reduced-motion
 * (falls back to a static y:0) and cleanup.
 */

import type { ReactNode } from "react";

import { gsap } from "@/lib/gsap";
import { useScrollScrub } from "@/hooks/use-scroll-scrub";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  /** px of vertical travel across the element's own scroll range. Negative moves it up as the page scrolls. */
  offset?: number;
  className?: string;
}

export function Parallax({ children, offset = -60, className }: ParallaxProps) {
  const containerRef = useScrollScrub<HTMLDivElement>({
    scrub: true,
    build: (container, baseVars) => {
      gsap.fromTo(
        container,
        { y: -offset / 2 },
        { y: offset / 2, ease: "none", scrollTrigger: baseVars }
      );
    },
    reducedMotionFallback: (container) => {
      gsap.set(container, { y: 0 });
    },
  });

  return (
    <div ref={containerRef} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
