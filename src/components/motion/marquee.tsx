"use client";

/**
 * An infinite horizontal marquee whose speed is coupled to Lenis scroll
 * velocity via useLenisVelocity — scrolling down accelerates it, scrolling
 * up reverses it, per REBUILD-SPEC.md section 03 (Client Marquee) and the
 * Quality tiers table's "Marquee vel." row. Renders two copies of the
 * children back-to-back and loops the translate at the first copy's
 * measured width, so the seam is invisible regardless of content length.
 *
 * Static (no animation, no velocity coupling) under prefers-reduced-motion
 * or the 'low' quality tier — the two conditions the Quality tiers table
 * marks as "static" for this row.
 *
 * Driven by the shared gsap.ticker rather than its own requestAnimationFrame
 * loop — see magnetic.tsx's docstring for why.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

import { useLenisVelocity } from "@/hooks/use-lenis-velocity";
import { useQualityTier } from "@/hooks/use-quality-tier";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  /** px/second at rest, before velocity coupling. */
  baseSpeed?: number;
  className?: string;
  itemClassName?: string;
  /** Opt-in: freezes the offset on pointer hover, resumes on leave.
   *  Default false so existing consumers (ClientMarquee, AboutTools) are
   *  unaffected. */
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  baseSpeed = 40,
  className,
  itemClassName,
  pauseOnHover = false,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const tier = useQualityTier();
  const velocityRef = useLenisVelocity();

  const isStatic = prefersReducedMotion || tier === "low";

  useEffect(() => {
    if (isStatic) return;

    const track = trackRef.current;
    const firstSet = firstSetRef.current;
    if (!track || !firstSet) return;

    let setWidth = firstSet.scrollWidth;
    const resizeObserver = new ResizeObserver(() => {
      setWidth = firstSet.scrollWidth;
    });
    resizeObserver.observe(firstSet);

    let offset = 0;

    const tick = (_time: number, deltaMs: number) => {
      if (isPausedRef.current) return;
      const delta = deltaMs / 1000;

      if (setWidth > 0) {
        const velocityMultiplier = 1 + velocityRef.current;
        offset -= baseSpeed * velocityMultiplier * delta;
        offset = ((offset % setWidth) + setWidth) % setWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
    };
  }, [isStatic, baseSpeed, velocityRef]);

  return (
    <div
      className={cn("overflow-hidden", className)}
      onPointerEnter={pauseOnHover ? () => (isPausedRef.current = true) : undefined}
      onPointerLeave={pauseOnHover ? () => (isPausedRef.current = false) : undefined}
    >
      <div
        ref={trackRef}
        className={cn("flex w-max", !isStatic && "will-change-transform")}
      >
        <div ref={firstSetRef} className={cn("flex shrink-0", itemClassName)}>
          {children}
        </div>
        <div aria-hidden="true" className={cn("flex shrink-0", itemClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
