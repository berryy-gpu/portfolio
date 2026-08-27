"use client";

/**
 * Experience timeline: a connecting vertical rule draws down via scaleY,
 * scrubbed 1:1 to scroll — same mechanic as the Process section
 * (src/components/sections/process.tsx).
 */

import { useRef } from "react";

import { Container } from "@/components/ui/container";
import { aboutContent } from "@/data/about";
import { useScrollScrub } from "@/hooks/use-scroll-scrub";
import { gsap } from "@/lib/gsap";

export function AboutTimeline() {
  const ruleRef = useRef<HTMLDivElement>(null);

  const scrubRef = useScrollScrub<HTMLDivElement>({
    start: "top 70%",
    end: "bottom 70%",
    scrub: true,
    build: (_container, baseVars) => {
      const rule = ruleRef.current;
      if (!rule) return;
      gsap.fromTo(rule, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: baseVars });
    },
    reducedMotionFallback: () => {
      if (ruleRef.current) gsap.set(ruleRef.current, { scaleY: 1 });
    },
  });

  if (aboutContent.timeline.length === 0) return null;

  return (
    <section className="py-expansive">
      <Container width="reading">
        <div className="flex flex-col gap-3 pb-12">
          <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
            Timeline
          </span>
          <h2 className="font-heading text-h2 text-text-primary">How I got here</h2>
        </div>

        <div ref={scrubRef} className="relative pl-8">
          <div
            ref={ruleRef}
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-0 w-px origin-top bg-accent"
          />
          <div className="flex flex-col">
            {aboutContent.timeline.map((entry) => (
              <div
                key={entry.year}
                className="flex gap-6 border-b border-border py-comfortable last:border-b-0"
              >
                <span className="w-28 shrink-0 font-mono text-caption tracking-caption text-text-tertiary">
                  {entry.year}
                </span>
                <p className="text-body text-text-secondary">{entry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
