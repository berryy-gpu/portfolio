"use client";

/**
 * The personal narrative — reading-width, generous paragraph spacing,
 * a restrained scroll reveal per paragraph. Typography carries this
 * section; no imagery, no decoration.
 */

import { Section } from "@/components/ui/section";
import { aboutContent } from "@/data/about";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function AboutStory() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='story-paragraph']",
    duration: duration.slow,
    ease: gsapEasing.entrance,
    y: 16,
    stagger: 0.1,
  });

  return (
    <Section spacing="cinematic" containerWidth="reading">
      <div ref={containerRef} className="flex flex-col gap-8">
        {aboutContent.storyParagraphs.map((paragraph, index) => (
          <p
            key={index}
            data-reveal="story-paragraph"
            className="text-body-lg text-text-secondary first:text-text-primary"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}
