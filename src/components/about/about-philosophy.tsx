"use client";

/**
 * Working philosophy as a single large editorial statement — a
 * pull-quote, not a card or a list. Distinct from philosophy.ts (the
 * six-stage client-facing process shown on the homepage) — this is a
 * personal design belief, in the user's own words.
 *
 * Centred at showcase width (not the narrow reading-width column) —
 * FIX 4's rebuild put Timeline directly before this, and Timeline's own
 * left-aligned reading-width list reads too similarly to this section's
 * old narrow-left-aligned treatment. Centering this one at full width
 * makes it read as the pull-quote moment it's meant to be instead of a
 * second consecutive narrow text block.
 */

import { Section } from "@/components/ui/section";
import { aboutContent } from "@/data/about";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function AboutPhilosophy() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='philosophy-statement']",
    duration: duration.slow,
    ease: gsapEasing.entrance,
    y: 16,
  });

  return (
    <Section header={{ eyebrow: "Philosophy" }} className="bg-surface">
      <div ref={containerRef} className="relative mx-auto max-w-4xl text-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-8 left-0 font-heading text-display-xxl text-accent/40 select-none md:-top-12"
        >
          &ldquo;
        </span>
        <p
          data-reveal="philosophy-statement"
          className="font-heading text-h2 text-text-primary"
        >
          {aboutContent.philosophy}
        </p>
      </div>
    </Section>
  );
}
