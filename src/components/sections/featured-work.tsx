"use client";

/**
 * Featured Work — the homepage's heaviest trust-building section. Per
 * Motion System §7: high but slow intensity, each card resolving on its
 * own before the next begins, no scroll-scrubbed gimmickry. Shows only
 * the clients homepage.ts marks as featured (Cybernetix, Pixelscape,
 * Aureate), in the order the Client Content Priority Matrix specifies —
 * that's a homepage presentation decision, not a fact about the project,
 * so it lives in homepage.ts rather than projects.ts. Links to
 * /work/[clientId] — the Client Hub route lands in Sprint 4; this is the
 * same accepted forward-link pattern used everywhere so far.
 */

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getClientById } from "@/data/clients";
import { getFeaturedProjects } from "@/data/homepage";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { getServicesForCategories } from "@/lib/get-services-for-categories";
import { duration, gsapEasing } from "@/lib/motion-tokens";

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
    <section className="py-generous md:py-expansive">
      <Container>
        <SectionHeader title="Featured Work" />

        <div ref={containerRef} className="flex flex-col gap-16 md:gap-24">
          {featuredProjects.map((project) => {
            const client = getClientById(project.clientId);
            const clientName = client?.name ?? project.title;
            const image = project.images[0];
            const cardServices = getServicesForCategories(
              project.categoryIds
            );

            return (
              <Link
                key={project.id}
                href={`/work/${project.clientId}`}
                data-reveal="featured-card"
                aria-label={`View ${clientName} case study`}
                className="group flex flex-col gap-6 rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {image && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-surface">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 1024px, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        </div>
      </Container>
    </section>
  );
}
