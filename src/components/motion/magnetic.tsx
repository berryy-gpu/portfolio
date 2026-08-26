"use client";

/**
 * Wraps a single element (a CTA button/link) and translates it toward the
 * cursor when the pointer comes within `radius` px of its center, capped
 * at `strength` px at the exact center and fading to 0 at the radius edge.
 * Both the pull and the spring-back on exit go through the same damped
 * follow used everywhere else on the site (lib/utils.ts `damp`).
 *
 * `children` must be a single element that forwards its ref to a real DOM
 * node — a native element, or a ref-forwarding component like next/link's
 * `<Link>`.
 *
 * Gated on (hover: hover) and (pointer: fine) — same convention as
 * cursor-spotlight.tsx — and fully inert under prefers-reduced-motion.
 * Transform-only (translate3d), so it stays compositor-driven inside the
 * pointer loop per the performance budget.
 */

import { cloneElement, useEffect, useRef, type ReactElement } from "react";
import { useReducedMotion } from "framer-motion";

import { useMediaQuery } from "@/hooks/use-media-query";
import { damp } from "@/lib/utils";

interface MagneticProps {
  children: ReactElement;
  /** px from the element's center where the pull starts. */
  radius?: number;
  /** max px translated toward the cursor, reached at dead-center. */
  strength?: number;
}

export function Magnetic({ children, radius = 120, strength = 12 }: MagneticProps) {
  const elRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = canHover && !prefersReducedMotion;

  useEffect(() => {
    if (!enabled) return;
    const el = elRef.current;
    if (!el) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frameId: number;
    let lastTime = performance.now();

    const handlePointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);

      if (distance > 0.01 && distance < radius) {
        const magnitude = (1 - distance / radius) * strength;
        target.x = (dx / distance) * magnitude;
        target.y = (dy / distance) * magnitude;
      } else {
        target.x = 0;
        target.y = 0;
      }
    };

    const tick = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      current.x = damp(current.x, target.x, 10, delta);
      current.y = damp(current.y, target.y, 10, delta);
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      frameId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove);
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frameId);
      el.style.transform = "";
    };
  }, [enabled, radius, strength]);

  return cloneElement(children, { ref: elRef } as object);
}
