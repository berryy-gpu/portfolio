"use client";

/**
 * From Idea to Impact — the site's one deliberately slow moment. Presents
 * the approved six-stage Working Philosophy (src/data/philosophy.ts) as a
 * restrained, text-led sequence rather than an iconified step-by-step
 * timeline — that visual pattern was ruled out from the start of this
 * project. Motion is Slow-tier and near-total restraint per Motion System
 * §7: it should barely feel animated.
 */

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { philosophyStages } from "@/data/philosophy";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function FromIdeaToImpact() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='philosophy-stage']",
    duration: duration.slow,
    ease: gsapEasing.entrance,
    y: 16,
    stagger: 0.12,
  });

  if (philosophyStages.length === 0) {
    return null;
  }

  return (
    <section className="py-generous md:py-expansive">
      <Container width="reading">
        <SectionHeader title="From Idea to Impact" width="reading" />

        <div ref={containerRef} className="flex flex-col">
          {philosophyStages.map((stage, index) => (
            <div
              key={stage.id}
              data-reveal="philosophy-stage"
              className="flex gap-6 border-b border-border py-comfortable last:border-b-0"
            >
              <span className="font-mono text-caption tracking-caption text-text-tertiary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-h4 text-text-primary">
                  {stage.title}
                </h3>
                <p className="text-body text-text-secondary">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
