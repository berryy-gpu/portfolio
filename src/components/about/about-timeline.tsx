"use client";

/**
 * Experience timeline — same numbered-row editorial language as
 * ClientProcess/From Idea to Impact (index + title + description,
 * hairline separators, no icons). Years stand in for titles here.
 */

import { Section } from "@/components/ui/section";
import { aboutContent } from "@/data/about";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function AboutTimeline() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='timeline-entry']",
    duration: duration.slow,
    ease: gsapEasing.entrance,
    y: 16,
    stagger: 0.08,
  });

  return (
    <Section
      spacing="cinematic"
      containerWidth="reading"
      header={{ eyebrow: "Timeline", title: "How I got here" }}
    >
      <div ref={containerRef} className="flex flex-col">
        {aboutContent.timeline.map((entry) => (
          <div
            key={entry.year}
            data-reveal="timeline-entry"
            className="flex gap-6 border-b border-border py-comfortable last:border-b-0"
          >
            <span className="w-28 shrink-0 font-mono text-caption tracking-caption text-text-tertiary">
              {entry.year}
            </span>
            <p className="text-body text-text-secondary">
              {entry.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
