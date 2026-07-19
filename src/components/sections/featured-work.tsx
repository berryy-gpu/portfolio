"use client";

/**
 * Featured Work — the homepage's heaviest trust-building section. Per
 * Motion System §7: high but slow intensity, each card resolving on its
 * own before the next begins, no scroll-scrubbed gimmickry. Shows all
 * five website projects homepage.ts lists as featured, in the order the
 * Client Content Priority Matrix specifies — that's a homepage
 * presentation decision, not a fact about the project, so it lives in
 * homepage.ts rather than projects.ts. Links to /work/[clientId] — the
 * Client Hub route lands in Sprint 4; this is the same accepted
 * forward-link pattern used everywhere so far.
 *
 * Each card's preview is an AnimatedWebsitePreview (src/components/ui) —
 * it owns all browser-frame/hover/scroll behavior; this section only
 * passes it each project's websitePreview data.
 *
 * Cards alternate preview/content sides by index (preview-left on even
 * cards, content-left on odd) so five consecutive full-bleed previews
 * don't read as one repetitive stack — pure layout rhythm, same
 * typography/spacing/color/motion tokens as every other card.
 */

import Link from "next/link";

import { AnimatedWebsitePreview } from "@/components/ui/animated-website-preview";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { getClientById } from "@/data/clients";
import { getFeaturedProjects } from "@/data/homepage";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { getServicesForCategories } from "@/lib/get-services-for-categories";
import { duration, gsapEasing } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

export function FeaturedWork() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='featured-card']",
    duration: duration.slow,
    ease: gsapEasing.entrance,
    y: 32,
    stagger: 0.15,
  });

  const featuredProjects = getFeaturedProjects();

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <Section
      header={{ title: "Featured Work" }}
      contentRef={containerRef}
      contentClassName="flex flex-col gap-16 md:gap-24"
    >
      {featuredProjects.map((project, index) => {
        const client = getClientById(project.clientId);
        const clientName = client?.name ?? project.title;
        const cardServices = getServicesForCategories(project.categoryIds);
        const isReversed = index % 2 === 1;

        return (
          <Link
            key={project.id}
            href={`/work/${project.clientId}`}
            data-reveal="featured-card"
            aria-label={`View ${clientName} case study`}
            className="grid grid-cols-1 items-center gap-8 rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none lg:grid-cols-[6fr_5fr] lg:gap-16"
          >
            {project.websitePreview && (
              <AnimatedWebsitePreview
                preview={project.websitePreview}
                className={isReversed ? "lg:order-2" : "lg:order-1"}
              />
            )}

            <div
              className={cn(
                "flex flex-col gap-4",
                isReversed ? "lg:order-1" : "lg:order-2"
              )}
            >
              <h3 className="font-heading text-h3 text-text-primary">
                {clientName}
              </h3>

              <div className="flex flex-wrap gap-2">
                {cardServices.map((service) => (
                  <Badge key={service.id}>{service.title}</Badge>
                ))}
              </div>
            </div>
          </Link>
        );
      })}
    </Section>
  );
}
