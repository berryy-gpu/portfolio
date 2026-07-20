"use client";

/**
 * The real tools this site itself is built with — reuses technologies.ts
 * as-is, grouped by category, rather than a separate invented "skills"
 * list.
 */

import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { technologies, type TechnologyCategory } from "@/data/technologies";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

const categoryLabels: Record<TechnologyCategory, string> = {
  framework: "Framework",
  language: "Language",
  styling: "Styling",
  ui: "UI",
  animation: "Animation",
  "3d": "3D",
};

export function AboutTools() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='tool-item']",
    duration: duration.normal,
    ease: gsapEasing.entrance,
    stagger: 0.04,
  });

  const sorted = [...technologies].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <Section
      spacing="cinematic"
      header={{ eyebrow: "Tools", title: "What this site is built with" }}
    >
      <div ref={containerRef} className="flex flex-wrap gap-3">
        {sorted.map((tech) => (
          <span key={tech.id} data-reveal="tool-item">
            <Badge className="px-4 py-2 text-small">
              {tech.name}
              <span className="ml-2 text-text-tertiary">
                {categoryLabels[tech.category]}
              </span>
            </Badge>
          </span>
        ))}
      </div>
    </Section>
  );
}
