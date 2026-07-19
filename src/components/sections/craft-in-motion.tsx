"use client";

/**
 * Craft in Motion — proves range into a second medium after the web-work
 * of Featured Work. Per Motion System §7 this section carries the highest
 * sustained intensity outside the Hero, but that intensity comes from the
 * footage's own cuts, not from a portfolio-imposed effect — no scroll-
 * scrubbing or horizontal pin, which the Motion System only ever listed
 * as a tentative, unconfirmed possibility. Shows the curated selection
 * craft-in-motion.ts defines; see that file for why those specific clips.
 */

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { VideoPlayer } from "@/components/ui/video-player";
import { getClientById } from "@/data/clients";
import { getCraftInMotionMedia } from "@/data/craft-in-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function CraftInMotion() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='craft-card']",
    duration: duration.normal,
    ease: gsapEasing.entrance,
    y: 24,
    stagger: 0.1,
  });

  const media = getCraftInMotionMedia();

  if (media.length === 0) {
    return null;
  }

  return (
    <section className="py-generous md:py-expansive">
      <Container>
        <SectionHeader title="Craft in Motion" />

        <div
          ref={containerRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {media.map((item) => {
            const client = getClientById(item.clientId);

            return (
              <div
                key={item.id}
                data-reveal="craft-card"
                className="flex flex-col gap-3"
              >
                <VideoPlayer src={item.src} title={item.title} />
                {client && (
                  <Badge className="self-start">{client.name}</Badge>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
