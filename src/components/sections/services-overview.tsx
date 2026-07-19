"use client";

/**
 * Services Overview — the homepage's fast orientation across all six
 * capabilities. Per Motion System §7: moderate intensity, quick uniform
 * stagger, no single card outweighs its neighbors. Filtering by category
 * is Sprint 3 scope — each card links to /work unfiltered for now, a real
 * working link rather than a broken or absent one.
 */

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { getCategoryById } from "@/data/categories";
import { services } from "@/data/services";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function ServicesOverview() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='service-card']",
    duration: duration.normal,
    ease: gsapEasing.entrance,
    stagger: 0.08,
  });

  if (services.length === 0) {
    return null;
  }

  const sortedServices = [...services].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <Section
      header={{ title: "Services" }}
      contentRef={containerRef}
      contentClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {sortedServices.map((service) => (
        <Link
          key={service.id}
          href="/work"
          data-reveal="service-card"
          aria-label={`Explore ${service.title} work`}
          className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <h3 className="font-heading text-h4 text-text-primary">
            {service.title}
          </h3>

          <div className="flex flex-wrap gap-2">
            {service.categoryIds.map((categoryId) => {
              const category = getCategoryById(categoryId);
              if (!category) return null;
              return <Badge key={categoryId}>{category.label}</Badge>;
            })}
          </div>
        </Link>
      ))}
    </Section>
  );
}
