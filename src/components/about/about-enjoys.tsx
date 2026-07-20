"use client";

/**
 * "What I Enjoy Building" — real, user-provided list, presented as
 * tags (reusing Badge) rather than a dense skills grid.
 */

import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { aboutContent } from "@/data/about";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function AboutEnjoys() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='enjoys-tag']",
    duration: duration.normal,
    ease: gsapEasing.entrance,
    stagger: 0.05,
  });

  return (
    <Section
      spacing="cinematic"
      header={{ eyebrow: "What I Enjoy Building", title: "Where I spend my time" }}
    >
      <div ref={containerRef} className="flex flex-wrap gap-3">
        {aboutContent.enjoys.map((item) => (
          <span key={item} data-reveal="enjoys-tag">
            <Badge className="px-4 py-2 text-small">{item}</Badge>
          </span>
        ))}
      </div>
    </Section>
  );
}
