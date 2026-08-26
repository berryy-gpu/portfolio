import { useRef } from "react";

import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

interface ScrollScrubBaseVars {
  trigger: HTMLElement;
  start: string;
  end: string;
  scrub: boolean | number;
  pin?: boolean | string;
}

interface UseScrollScrubOptions {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean | string;
  /**
   * Builds the scrubbed animation. Receives the container element and a
   * ready-to-use ScrollTrigger vars object (trigger/start/end/scrub/pin
   * already filled in) — spread it into `scrollTrigger:` on whatever
   * gsap.timeline()/gsap.to() call you build. Only called outside
   * prefers-reduced-motion.
   */
  build: (container: HTMLElement, baseVars: ScrollScrubBaseVars) => void;
  /** Runs instead of `build` under prefers-reduced-motion — set the static end state. */
  reducedMotionFallback?: (container: HTMLElement) => void;
}

/**
 * Shared scaffolding for scroll-scrubbed animations — the `scrubHighlight`,
 * `horizontalPin`, and scrubbed parts of `counterUp`/`settle` grammars all
 * build on this. The scrub equivalent of useScrollReveal's one-time
 * entrance: same gsap.matchMedia()-based prefers-reduced-motion handling
 * and cleanup, but the caller supplies the actual tween/timeline via
 * `build` instead of getting a fixed from/to animation.
 */
export function useScrollScrub<T extends HTMLElement>({
  start = "top bottom",
  end = "bottom top",
  scrub = true,
  pin = false,
  build,
  reducedMotionFallback,
}: UseScrollScrubOptions) {
  const containerRef = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };

      if (reduceMotion) {
        reducedMotionFallback?.(container);
        return;
      }

      build(container, { trigger: container, start, end, scrub, pin });
    });

    return () => mm.revert();
  }, [start, end, scrub, pin, build, reducedMotionFallback]);

  return containerRef;
}

export type { ScrollScrubBaseVars };
