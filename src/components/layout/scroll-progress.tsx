"use client";

/**
 * Fixed 1px progress bar at the very top, above nav, below the
 * transition overlay — reads Step 2's useScrollProgress() ref directly
 * on the shared gsap.ticker (the same one driving Lenis), never React
 * state and never its own requestAnimationFrame loop — see
 * magnetic.tsx's docstring for why. transform: scaleX() with
 * transform-origin left so it stays a compositor-only update per the
 * performance budget. Hidden entirely under prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { gsap } from "@/lib/gsap";
import { zIndex } from "@/lib/motion-tokens";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const bar = barRef.current;
    if (!bar) return;

    const tick = () => {
      bar.style.transform = `scaleX(${progress.current})`;
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [progress, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      style={{ zIndex: zIndex.scrollProgress }}
      className="fixed inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent"
      ref={barRef}
    />
  );
}
