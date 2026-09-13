"use client";

/**
 * Classic "decrypt" hover effect: while `active`, characters randomize and
 * progressively lock in left-to-right over ~550ms; going inactive resolves
 * immediately back to the real text (no reverse-scramble).
 *
 * Purely decorative — hero.tsx renders this inside an `aria-hidden`
 * overlay stacked on top of a separate, always-static, always-real h1 (see
 * that file's comment), so this component carries no accessible name of
 * its own. It's kept out of that h1 deliberately: the h1's mount entrance
 * is a GSAP SplitText line-mask reveal, which rebuilds its subtree's DOM
 * via innerHTML during split/revert — confirmed live (real hover, Chrome)
 * that a ScrambleText nested there fires its state updates correctly but
 * they never reach the screen, because revert() re-parses fresh nodes from
 * saved HTML rather than restoring the exact instances React committed,
 * orphaning any fiber still pointing at the pre-split node. Living in a
 * plain sibling element outside that subtree avoids the conflict entirely.
 *
 * Driven by its own short-lived rAF loop (not the shared gsap.ticker like
 * magnetic.tsx) — this only runs for ~550ms per hover-enter, not for the
 * life of the pointer being nearby, so it doesn't compete with the
 * ticker-budget concerns that apply to continuous per-frame effects.
 */

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*";
const DURATION_MS = 550;

function randomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

interface ScrambleTextProps {
  text: string;
  active: boolean;
  className?: string;
}

export function ScrambleText({ text, active, className }: ScrambleTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!active || prefersReducedMotion) {
      setDisplay(text);
      return;
    }

    let frameId: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const lockedCount = Math.floor(progress * text.length);

      setDisplay(
        text
          .split("")
          .map((char, index) =>
            /\s/.test(char) || index < lockedCount ? char : randomChar()
          )
          .join("")
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active, prefersReducedMotion, text]);

  return <span className={className}>{display}</span>;
}
