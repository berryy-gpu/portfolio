"use client";

/**
 * The approach behind every engagement — reuses the same real Working
 * Philosophy data as the homepage's "From Idea to Impact" (no per-client
 * process details exist, and none are invented; this is the honest,
 * already-approved process content, presented compactly here since it's
 * a supporting section on a client page, not the page's own hero).
 *
 * Copy is a prop, not hardcoded — see src/data/client-presentation.ts.
 */

import { Section } from "@/components/ui/section";
import type { ClientSectionCopy } from "@/data/client-presentation";
import { philosophyStages } from "@/data/philosophy";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

interface ClientProcessProps {
  copy: ClientSectionCopy;
}

export function ClientProcess({ copy }: ClientProcessProps) {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='process-stage']",
    duration: duration.slow,
    ease: gsapEasing.entrance,
    y: 16,
    stagger: 0.08,
  });

  return (
    <Section spacing="default" containerWidth="reading" header={copy}>
      <div ref={containerRef} className="flex flex-col">
        {philosophyStages.map((stage, index) => (
          <div
            key={stage.id}
            data-reveal="process-stage"
            className="flex gap-6 border-b border-border py-comfortable last:border-b-0"
          >
            <span className="font-mono text-caption tracking-caption text-text-tertiary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-h4 text-text-primary">
                {stage.title}
              </h3>
              <p className="text-small text-text-secondary">
                {stage.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
