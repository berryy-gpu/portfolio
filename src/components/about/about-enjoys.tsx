"use client";

/**
 * "What I Enjoy Building" — real, user-provided list, presented as tags
 * (reusing Badge), plus a real personal photo as a visual anchor instead
 * of leaving the section text-only. Two columns on lg+ (tags left, photo
 * right); single column below lg with the photo FIRST — same stacking
 * convention as about-statement.tsx (`order-1 lg:order-2` / `order-2
 * lg:order-1`, DOM order drives mobile stacking, grid placement drives
 * lg+). The caption under the photo ("Off the clock") is the real line
 * printed on the source image itself, not invented copy.
 */

import { RevealImage } from "@/components/motion/reveal-image";
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
    <Section header={{ eyebrow: "What I Enjoy Building", title: "Where I spend my time" }}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div ref={containerRef} className="order-2 flex flex-wrap gap-3 lg:order-1">
          {aboutContent.enjoys.map((item) => (
            <span key={item} data-reveal="enjoys-tag">
              <Badge className="px-4 py-2 text-small">{item}</Badge>
            </span>
          ))}
        </div>

        <div className="order-1 flex flex-col gap-3 lg:order-2">
          <div className="relative aspect-9/16 max-h-[640px] w-full overflow-hidden rounded-lg">
            <RevealImage
              src="/images/profile/about-night-rides.webp"
              alt="Baran Haider with his motorcycle at night"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              containerClassName="relative h-full w-full"
            />
          </div>
          <p className="text-center font-mono text-caption tracking-caption text-text-tertiary uppercase">
            Off the clock
          </p>
        </div>
      </div>
    </Section>
  );
}
