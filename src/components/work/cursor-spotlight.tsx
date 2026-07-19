"use client";

/**
 * A soft, page-wide glow that follows the cursor — the page's one
 * "cursor-reactive lighting" moment, applied globally rather than
 * per-section so it reads as the room being lit by where you look,
 * not a gimmick bolted onto individual cards.
 *
 * Position is written straight to CSS custom properties inside a
 * rAF-throttled mousemove handler — no React state, no re-renders.
 * Positioning itself is a `transform: translate()` reading those custom
 * properties, not `left`/`top` (which it originally was) — `left`/`top`
 * force layout on every update, and on a `blur-3xl` element that's a
 * genuinely expensive repaint on every cursor move. `transform` (plus
 * `will-change-transform`) keeps this compositor-only. Confirmed via
 * CPU-throttled Playwright profiling as a real contributor to a reported
 * scroll-freeze bug (same root cause as WorkAmbientBackground's blobs).
 *
 * Desktop + real-hover only (mirrors AnimatedWebsitePreview's own
 * `(hover: hover) and (pointer: fine)` gate) and skipped entirely under
 * prefers-reduced-motion, since it's pure decoration with zero
 * functional purpose for anyone who'd rather not see it move.
 */

import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

import { useMediaQuery } from "@/hooks/use-media-query";

export function CursorSpotlight() {
  const glowRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = canHover && !prefersReducedMotion;

  useEffect(() => {
    if (!enabled) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(() => {
        glowRef.current?.style.setProperty("--spotlight-x", `${event.clientX}px`);
        glowRef.current?.style.setProperty("--spotlight-y", `${event.clientY}px`);
        glowRef.current?.style.setProperty("--spotlight-opacity", "1");
        frameRef.current = null;
      });
    };

    const handlePointerLeave = () => {
      glowRef.current?.style.setProperty("--spotlight-opacity", "0");
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={
        {
          "--spotlight-x": "50%",
          "--spotlight-y": "50%",
          "--spotlight-opacity": 0,
        } as CSSProperties
      }
      className="pointer-events-none fixed inset-0 -z-10 opacity-(--spotlight-opacity) transition-opacity duration-500"
    >
      <div
        className="absolute top-0 left-0 h-[32rem] w-[32rem] rounded-full bg-accent/[0.05] blur-3xl will-change-transform"
        style={{
          transform:
            "translate(calc(var(--spotlight-x) - 50%), calc(var(--spotlight-y) - 50%))",
        }}
      />
    </div>
  );
}
