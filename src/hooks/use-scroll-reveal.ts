import { useRef } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

interface ScrollRevealOptions {
  /** CSS selector, resolved within the returned container ref. */
  selector: string;
  duration?: number;
  ease?: string;
  y?: number;
  stagger?: number;
}

/**
 * Shared scroll-triggered entrance reveal for homepage sections.
 *
 * Why this hook exists: every section that reveals content on scroll
 * needs the same setup — detect reduced motion, set the initial hidden
 * state, wire a ScrollTrigger, tear it down on unmount.
 * ScrollTrigger.batch() covers both "several cards stagger in together"
 * (Services Overview) and "each card resolves on its own as it arrives"
 * (Featured Work), so one hook serves both instead of each section
 * reimplementing the same setup.
 *
 * Why GSAP, not Framer Motion: the Motion System's own division of
 * responsibility is scroll-driven animation → GSAP, state-driven
 * animation → Framer Motion (used for the Hero's mount-triggered
 * entrance, see hero.tsx). This hook is scroll-driven by definition, so
 * it belongs to GSAP/ScrollTrigger, not Framer.
 *
 * Reduced motion: checked via gsap.matchMedia() against
 * `(prefers-reduced-motion: reduce)`. When it matches, elements are set
 * straight to their final visible state with gsap.set() — no partial or
 * paused animation, and no ScrollTrigger is created at all in that case.
 *
 * Cleanup: the gsap.matchMedia() instance (and everything it created,
 * including the ScrollTrigger) is torn down via mm.revert() when the
 * component unmounts or any option changes.
 *
 * Use this for section-level scroll reveals only — not for mount-
 * triggered entrances (that's Framer Motion's job) and not for anything
 * that isn't a one-time reveal.
 */
export function useScrollReveal<T extends HTMLElement>({
  selector,
  duration = 0.5,
  ease = "power2.out",
  y = 24,
  stagger = 0.1,
}: ScrollRevealOptions) {
  const containerRef = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { reduceMotion } = context.conditions as {
          reduceMotion: boolean;
        };
        const elements = container.querySelectorAll<HTMLElement>(selector);

        if (reduceMotion) {
          gsap.set(elements, { opacity: 1, y: 0 });
          return;
        }

        gsap.set(elements, { opacity: 0, y });

        ScrollTrigger.batch(elements, {
          start: "top 85%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration,
              ease,
              stagger,
              overwrite: true,
            }),
        });
      }
    );

    return () => mm.revert();
  }, [selector, duration, ease, y, stagger]);

  return containerRef;
}
