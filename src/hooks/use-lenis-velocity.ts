"use client";

import { useEffect, useRef } from "react";

import { useLenis } from "@/components/providers/smooth-scroller";
import { damp } from "@/lib/utils";

const MAX_MULTIPLIER = 3;
const VELOCITY_DIVISOR = 12;
const SMOOTHING = 6;

/**
 * Exposes Lenis scroll velocity as a live ref — never React state, since
 * this updates on every scroll tick and a re-render per tick would defeat
 * the point. `velocityRef.current` is a damped multiplier clamped to
 * +/-3x, positive scrolling down and negative scrolling up, decaying
 * toward 0 as Lenis's own momentum settles. Read it inside a consumer's
 * own rAF loop (see components/motion/marquee.tsx) rather than subscribing
 * to it as state.
 */
export function useLenisVelocity() {
  const lenis = useLenis();
  const velocityRef = useRef(0);

  useEffect(() => {
    if (!lenis) return;

    const targetRef = { current: 0 };

    const unsubscribe = lenis.on("scroll", (instance) => {
      targetRef.current = Math.max(
        -MAX_MULTIPLIER,
        Math.min(MAX_MULTIPLIER, instance.velocity / VELOCITY_DIVISOR)
      );
    });

    let frameId: number;
    let lastTime = performance.now();

    const tick = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      velocityRef.current = damp(
        velocityRef.current,
        targetRef.current,
        SMOOTHING,
        delta
      );
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      unsubscribe();
      cancelAnimationFrame(frameId);
    };
  }, [lenis]);

  return velocityRef;
}
