/**
 * Tools as a velocity marquee (REBUILD-SPEC.md /about spec) — the real
 * tools this site itself is built with, reusing technologies.ts as-is.
 */

import { Marquee } from "@/components/motion/marquee";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { technologies, type TechnologyCategory } from "@/data/technologies";

const categoryLabels: Record<TechnologyCategory, string> = {
  framework: "Framework",
  language: "Language",
  styling: "Styling",
  ui: "UI",
  animation: "Animation",
  "3d": "3D",
};

export function AboutTools() {
  const sorted = [...technologies].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (sorted.length === 0) return null;

  return (
    <section className="py-expansive">
      <Container className="pb-8">
        <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
          Tools
        </span>
        <h2 className="mt-2 font-heading text-h2 text-text-primary">
          What this site is built with
        </h2>
      </Container>

      <Marquee baseSpeed={30} itemClassName="items-center gap-4 px-4">
        {sorted.map((tech) => (
          <Badge key={tech.id} className="px-4 py-2 text-small">
            {tech.name}
            <span className="ml-2 text-text-tertiary">{categoryLabels[tech.category]}</span>
          </Badge>
        ))}
      </Marquee>
    </section>
  );
}
