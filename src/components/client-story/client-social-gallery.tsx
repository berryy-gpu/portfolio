"use client";

/**
 * A single client's real social posts as an editorial masonry — same
 * CSS multi-column technique as the Work page's Campaign Gallery, but
 * deliberately simpler: one client's own images need no cross-client
 * interleaving, and hover here is a plain scale, not the cursor-tracked
 * tilt/spotlight built for the Work page (no reason to carry that
 * complexity into a single-client detail section).
 *
 * Copy is a prop, not hardcoded — see src/data/client-presentation.ts.
 */

import Image from "next/image";

import { Section } from "@/components/ui/section";
import type { ClientSectionCopy } from "@/data/client-presentation";
import type { SocialCampaign } from "@/data/socialCampaigns";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

interface ClientSocialGalleryProps {
  campaign: SocialCampaign;
  copy: ClientSectionCopy;
}

export function ClientSocialGallery({
  campaign,
  copy,
}: ClientSocialGalleryProps) {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='social-post']",
    duration: duration.normal,
    ease: gsapEasing.entrance,
    y: 20,
    stagger: 0.06,
  });

  if (campaign.images.length === 0) {
    return null;
  }

  return (
    <Section spacing="default" header={copy}>
      <div
        ref={containerRef}
        className="columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8"
      >
        {campaign.images.map((image) => (
          <div
            key={image.src}
            data-reveal="social-post"
            className="group relative mb-6 break-inside-avoid overflow-hidden rounded-lg border border-border bg-surface lg:mb-8"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
