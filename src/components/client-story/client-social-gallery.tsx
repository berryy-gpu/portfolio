"use client";

/**
 * Masonry, clipReveal staggered BY COLUMN so it doesn't reveal as one
 * wave — an explicit 3-column split (round-robin) rather than CSS
 * multi-column, so each column can carry its own stagger group and an
 * increasing per-column delay. Images keep their real aspect ratio via
 * `aspectRatio` from their real stored width/height, no layout shift.
 *
 * WARNING this data crosses: public/images/social/"friends perk" has a
 * literal space in the folder name plus inconsistent casing and mixed
 * .jpg/.jpeg — the paths are stored correctly as-is in socialCampaigns.ts
 * and next/image encodes them correctly when building the optimized
 * image URL, so no manual encoding here (double-encoding would break it).
 */

import Image from "next/image";
import { useRef } from "react";

import { Container } from "@/components/ui/container";
import type { ClientSectionCopy } from "@/data/client-presentation";
import type { SocialCampaign } from "@/data/socialCampaigns";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { revealPresets } from "@/lib/reveal-presets";

interface ClientSocialGalleryProps {
  campaign: SocialCampaign;
  copy: ClientSectionCopy;
}

const COLUMN_COUNT = 3;

export function ClientSocialGallery({ campaign, copy }: ClientSocialGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = revealPresets.clipReveal;

  const columns = Array.from({ length: COLUMN_COUNT }, (_, columnIndex) =>
    campaign.images.filter((_, imageIndex) => imageIndex % COLUMN_COUNT === columnIndex)
  );

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };
      const columnEls = container.querySelectorAll<HTMLElement>("[data-gallery-column]");

      columnEls.forEach((columnEl, columnIndex) => {
        const images = columnEl.querySelectorAll<HTMLElement>("[data-gallery-image]");
        if (images.length === 0) return;

        if (reduceMotion) {
          gsap.set(images, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
          return;
        }

        gsap.set(images, { clipPath: "inset(0% 0% 100% 0%)", scale: config.scaleFrom });

        ScrollTrigger.batch(images, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              duration: config.duration,
              ease: config.ease,
              stagger: 0.08,
              delay: columnIndex * 0.1,
            }),
        });
      });
    });

    return () => mm.revert();
  }, [campaign.id, config.duration, config.ease, config.scaleFrom]);

  if (campaign.images.length === 0) return null;

  return (
    <section className="py-generous md:py-expansive">
      <Container>
        <div className="flex flex-col gap-3 pb-12">
          {copy.eyebrow && (
            <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
              {copy.eyebrow}
            </span>
          )}
          <h2 className="font-heading text-h2 text-text-primary">{copy.title}</h2>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
          {columns.map((columnImages, columnIndex) => (
            <div
              key={columnIndex}
              data-gallery-column
              className="flex flex-col gap-6 lg:gap-8"
            >
              {columnImages.map((image) => (
                <div
                  key={image.src}
                  data-gallery-image
                  className="relative overflow-hidden rounded-lg border border-border bg-surface"
                  style={{ aspectRatio: `${image.width} / ${image.height}` }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
