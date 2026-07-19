"use client";

/**
 * What I Can Help You Build — reframes the same service/category data
 * Services Overview lists individually into three outcome-level pillars.
 * Deliberately a different visual treatment (large editorial rows, full
 * width, related-service badges) so it reads as business value rather
 * than a second services list.
 */

import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { getOutcomePillars } from "@/data/outcomes";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { getServicesForCategories } from "@/lib/get-services-for-categories";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function WhatICanHelpYouBuild() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='outcome-pillar']",
    duration: duration.normal,
    ease: gsapEasing.entrance,
    y: 20,
    stagger: 0.12,
  });

  const pillars = getOutcomePillars();

  if (pillars.length === 0) {
    return null;
  }

  return (
    <Section
      header={{ title: "What I Can Help You Build" }}
      contentRef={containerRef}
      contentClassName="flex flex-col"
    >
      {pillars.map((pillar) => {
        const relatedServices = getServicesForCategories(pillar.categoryIds);

        return (
          <div
            key={pillar.id}
            data-reveal="outcome-pillar"
            className="flex flex-col gap-4 border-b border-border py-comfortable last:border-b-0 md:flex-row md:items-start md:justify-between md:gap-12"
          >
            <div className="flex flex-col gap-3 md:max-w-xl">
              <h3 className="font-heading text-h3 text-text-primary">
                {pillar.title}
              </h3>
              <p className="text-body text-text-secondary">
                {pillar.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              {relatedServices.map((service) => (
                <Badge key={service.id}>{service.title}</Badge>
              ))}
            </div>
          </div>
        );
      })}
    </Section>
  );
}
