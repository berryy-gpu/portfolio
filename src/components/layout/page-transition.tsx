"use client";

/**
 * The transition overlay's DOM + GSAP animation only — the routing/Lenis
 * orchestration lives in providers/transition-provider.tsx. Covering and
 * revealing are the same upward wipe continued: clip-path animates
 * inset(100% 0 0 0) -> inset(0) to cover (the panel rises to fill the
 * screen), then inset(0) -> inset(0 0 100% 0) to reveal (it keeps rising
 * and clips away off the top) — REBUILD-SPEC.md's page-transition spec.
 */

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { usePageTransition } from "@/components/providers/transition-provider";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { gsap } from "@/lib/gsap";
import { zIndex } from "@/lib/motion-tokens";

export function PageTransition() {
  const { phase, destinationLabel, notifyCoverComplete, notifyRevealComplete } =
    usePageTransition();
  const overlayRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (phase === "covering") {
      gsap.set(overlay, { clipPath: "inset(100% 0 0 0)" });
      gsap.to(overlay, {
        clipPath: "inset(0% 0 0 0)",
        duration: prefersReducedMotion ? 0.2 : 0.6,
        ease: prefersReducedMotion ? "power1.inOut" : "expo.inOut",
        onComplete: notifyCoverComplete,
      });
    }

    if (phase === "revealing") {
      gsap.to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: prefersReducedMotion ? 0.2 : 0.6,
        ease: prefersReducedMotion ? "power1.inOut" : "expo.inOut",
        onComplete: notifyRevealComplete,
      });
    }
  }, [phase, prefersReducedMotion, notifyCoverComplete, notifyRevealComplete]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{ clipPath: "inset(100% 0 0 0)", zIndex: zIndex.overlayScrim }}
      className="pointer-events-none fixed inset-0 flex items-center justify-center bg-surface"
    >
      {phase !== "idle" && destinationLabel && (
        <span className="font-mono text-caption tracking-caption text-text-secondary uppercase">
          {destinationLabel}
        </span>
      )}
    </div>
  );
}
