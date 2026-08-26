/**
 * REBUILD-SPEC.md section 03 — velocity-coupled infinite marquee of real
 * client logos (mono variant — already white-on-transparent, no CSS
 * filter recolor). friends-perk-cafe has no logo asset: falls back to its
 * real name as a text wordmark rather than inventing artwork.
 */

import Image from "next/image";

import { TransitionLink } from "@/components/layout/transition-link";
import { Marquee } from "@/components/motion/marquee";
import { clients, getClientLogoDimensions, getClientLogoPath } from "@/data/clients";

export function ClientMarquee() {
  if (clients.length === 0) return null;

  return (
    <section className="border-y border-border py-comfortable">
      <Marquee baseSpeed={36} itemClassName="items-center gap-16 px-8">
        {clients.map((client) => {
          const logo = getClientLogoPath(client.id, "mono");
          const dimensions = getClientLogoDimensions(client.id);

          return (
            <TransitionLink
              key={client.id}
              href={`/work/${client.id}`}
              label={client.name}
              className="flex h-10 w-32 shrink-0 items-center justify-center opacity-60 transition-opacity duration-300 hover:opacity-100"
            >
              {logo && dimensions ? (
                <Image
                  src={logo}
                  alt={client.name}
                  width={dimensions.width}
                  height={dimensions.height}
                  className="h-full w-auto object-contain"
                />
              ) : (
                <span className="font-mono text-caption tracking-caption text-text-primary uppercase">
                  {client.name}
                </span>
              )}
            </TransitionLink>
          );
        })}
      </Marquee>
    </section>
  );
}
