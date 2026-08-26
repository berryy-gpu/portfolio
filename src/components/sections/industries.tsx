"use client";

/**
 * REBUILD-SPEC.md 4b — homepage, directly after Capabilities. Every real
 * industry a client actually works in, derived from Client.industry
 * (clients.ts) rather than a separately maintained "who we serve" list
 * that could drift out of sync with who the clients actually are.
 */

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getDistinctIndustries } from "@/data/clients";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function Industries() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='industry']",
    duration: duration.fast,
    ease: gsapEasing.entrance,
    y: 12,
    stagger: 0.04,
  });

  const industries = getDistinctIndustries();

  if (industries.length === 0) return null;

  return (
    <section className="py-comfortable">
      <Container>
        <SectionHeader eyebrow="Who I Work With" title="Industries" />

        <div ref={containerRef} className="flex flex-wrap gap-3">
          {industries.map((industry) => (
            <Badge key={industry} data-reveal="industry" className="text-body">
              {industry}
            </Badge>
          ))}
        </div>
      </Container>
    </section>
  );
}
