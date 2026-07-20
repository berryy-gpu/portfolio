"use client";

/**
 * Working philosophy as a single large editorial statement — a
 * pull-quote, not a card or a list. Distinct from philosophy.ts (the
 * six-stage client-facing process shown on the homepage) — this is a
 * personal design belief, in the user's own words.
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
    <Section spacing="cinematic" containerWidth="reading">
      <div ref={containerRef}>
        <p
          data-reveal="philosophy-statement"
          className="font-heading text-h2 text-text-primary md:text-h1"
        >
          {aboutContent.philosophy}
        </p>
      </div>
    </Section>
  );
}
