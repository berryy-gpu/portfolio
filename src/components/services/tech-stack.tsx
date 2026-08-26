/**
 * REBUILD-SPEC.md 4c — /services, the stack this site (and client work)
 * is actually built with, from data/technologies.ts. Grouped by category
 * rather than one flat list, purely presentational (no scroll rig) since
 * REBUILD-SPEC.md doesn't call for motion here.
 */

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { technologies, type TechnologyCategory } from "@/data/technologies";

const CATEGORY_LABELS: Record<TechnologyCategory, string> = {
  framework: "Framework",
  language: "Language",
  styling: "Styling",
  ui: "UI",
  animation: "Animation",
  "3d": "3D",
};

const CATEGORY_ORDER: TechnologyCategory[] = [
  "framework",
  "language",
  "styling",
  "ui",
  "animation",
  "3d",
];

export function TechStack() {
  if (technologies.length === 0) return null;

  const sorted = [...technologies].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: sorted.filter((tech) => tech.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <section className="py-expansive">
      <Container>
        <SectionHeader eyebrow="How It's Built" title="Tech Stack" />

        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div
              key={group.category}
              className="flex flex-col gap-3 border-b border-border pb-6 last:border-b-0 md:flex-row md:items-center md:gap-8"
            >
              <span className="w-32 shrink-0 font-mono text-caption tracking-caption text-text-tertiary uppercase">
                {CATEGORY_LABELS[group.category]}
              </span>
              <div className="flex flex-wrap gap-3">
                {group.items.map((tech) => (
                  <Badge key={tech.id}>{tech.name}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
