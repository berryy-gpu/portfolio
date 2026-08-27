"use client";

import { useEffect, useRef } from "react";

import { useLenis } from "@/components/providers/smooth-scroller";
import { gsap } from "@/lib/gsap";
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
 * own gsap.ticker callback (see components/motion/marquee.tsx) rather
 * than subscribing to it as state.
 *
 * The damping tick itself rides the shared gsap.ticker (the same one
 * driving Lenis) instead of its own requestAnimationFrame loop — see
 * magnetic.tsx's docstring for why every damped-follow effect on the
 * site shares that one ticker rather than spawning its own.
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

    const tick = (_time: number, deltaMs: number) => {
      const delta = deltaMs / 1000;
      velocityRef.current = damp(
        velocityRef.current,
        targetRef.current,
        SMOOTHING,
        delta
      );
    };
    gsap.ticker.add(tick);

    return () => {
      unsubscribe();
      gsap.ticker.remove(tick);
    };
  }, [lenis]);

  return velocityRef;
}
