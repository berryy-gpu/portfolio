"use client";

/**
 * REBUILD-SPEC.md /work/[clientId] hero: client logo + name at
 * display-xxl, one full-bleed image with clipReveal, meta row. Only real
 * facts in the meta row — services and the live domain (both derived
 * from story data); no invented "year"/"role" fields, which don't exist
 * anywhere in the data layer.
 */

import Image from "next/image";

import { RevealImage } from "@/components/motion/reveal-image";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { ImageCaption } from "@/components/ui/image-caption";
import { getClientLogoDimensions, getClientLogoPath } from "@/data/clients";
import type { ClientStoryDetail } from "@/data/client-story";
import { ENGAGEMENT_LABELS, getClientEngagement } from "@/data/projects";

interface ClientHeroProps {
  story: ClientStoryDetail;
}

export function ClientHero({ story }: ClientHeroProps) {
  const domain = story.project?.websitePreview?.domain;
  const heroImage = story.project?.websitePreview?.image ?? story.project?.images[0];
  // Captions only exist on ProjectImage, not WebsitePreviewImage — only
  // possible when the hero fell back to the plain images[0] path.
  const heroImageCaption = story.project?.websitePreview ? undefined : story.project?.images[0]?.caption;
  const logo = getClientLogoPath(story.client.id, "color");
  const logoDimensions = getClientLogoDimensions(story.client.id);
  const engagement = getClientEngagement(story.client.id);

  return (
    <section className="flex flex-col gap-10 py-generous md:py-expansive">
      <Container className="flex flex-col gap-6">
        {logo && logoDimensions && (
          <Image
            src={logo}
            alt={story.client.name}
            width={logoDimensions.width}
            height={logoDimensions.height}
            className="h-10 w-auto object-contain"
          />
        )}

        <h1 className="font-heading text-display-xxl tracking-display text-text-primary">
          {story.client.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          {engagement && (
            <Badge className="border-accent/40 text-accent">
              {ENGAGEMENT_LABELS[engagement]}
            </Badge>
          )}
          {story.services.map((service) => (
            <Badge key={service.id}>{service.title}</Badge>
          ))}
          {domain && (
            <a
              href={`https://${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-caption tracking-caption text-accent uppercase transition-colors hover:text-text-primary"
            >
              {domain} ↗
            </a>
          )}
        </div>
      </Container>

      {heroImage && (
        <>
          <RevealImage
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            sizes="100vw"
            containerClassName="relative aspect-video w-full"
          />
          <Container>
            <ImageCaption index={0} caption={heroImageCaption} />
          </Container>
        </>
      )}
    </section>
  );
}
