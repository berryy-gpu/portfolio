"use client";

/**
 * The `maskUp` and `charCascade` grammars from REBUILD-SPEC.md's motion
 * vocabulary — a line (or, for `charCascade`, a character) rises out of an
 * overflow-hidden mask. Built on GSAP's SplitText (bundled free with gsap
 * 3.13+), which owns both the splitting and the mask wrapper via its
 * `mask` option, so there's no manual line-detection code to maintain here.
 *
 * `trigger="scroll"` (default) reveals via ScrollTrigger once the element
 * nears the viewport — use this for section headlines. `trigger="mount"`
 * plays immediately on mount with no ScrollTrigger — this is what
 * `charCascade` needs for the Hero, which animates in on page load rather
 * than on scroll.
 *
 * `autoSplit: true` makes SplitText re-split (and GSAP's onSplit re-run) on
 * webfont load and resize, so line breaks stay correct once Cabinet
 * Grotesk/General Sans finish loading rather than splitting against a
 * fallback font's line-wrap.
 */

import { createElement, useRef, type ElementType, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

import { gsap, SplitText } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { revealPresets } from "@/lib/reveal-presets";

type SplitTextPreset = "maskUp" | "charCascade";

interface SplitTextRevealProps {
  /**
   * Plain text, or JSX with inline formatting (e.g. one word wrapped in
   * an accent-colored span) — GSAP's SplitText operates on the element's
   * real rendered DOM, not a text prop, so nested markup splits and
   * animates correctly along with everything else. Not intended for
   * children that change after mount (see the effect's dependency array
   * below) — every current use is static content decided once.
   */
  children: ReactNode;
  as?: ElementType;
  className?: string;
  preset?: SplitTextPreset;
  trigger?: "mount" | "scroll";
  /** ScrollTrigger `start`, only relevant when trigger="scroll". */
  start?: string;
  delay?: number;
}

export function SplitTextReveal({
  children,
  as: Tag = "div",
  className,
  preset = "maskUp",
  trigger = "scroll",
  start = "top 85%",
  delay = 0,
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const config = revealPresets[preset];

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    const splitType = preset === "charCascade" ? "chars" : "lines";
    let tween: gsap.core.Tween | undefined;

    const split = SplitText.create(el, {
      type: splitType,
      mask: splitType,
      autoSplit: true,
      onSplit: (self) => {
        const targets = preset === "charCascade" ? self.chars : self.lines;

        gsap.set(
          targets,
          preset === "charCascade" ? { autoAlpha: 0 } : { yPercent: 100 }
        );

        tween = gsap.to(targets, {
          ...(preset === "charCascade" ? { autoAlpha: 1 } : { yPercent: 0 }),
          duration: config.duration,
          ease: config.ease,
          stagger: config.stagger,
          delay,
          scrollTrigger:
            trigger === "scroll" ? { trigger: el, start, once: true } : undefined,
        });

        return tween;
      },
    });

    return () => {
      tween?.scrollTrigger?.kill();
      split.revert();
    };
    // children intentionally excluded — see the prop's doc comment. JSX
    // children get a new object identity every render, which would
    // re-split/re-animate on every unrelated parent re-render otherwise.
  }, [preset, trigger, start, delay, prefersReducedMotion]);

  return createElement(
    Tag,
    { ref: containerRef, className },
    children
  );
}
