"use client";

/**
 * REBUILD-SPEC.md 4a — homepage, between Stats and Testimonials. Four
 * real clients' real local time, ticking live, derived from their actual
 * Client.location (src/data/client-timezones.ts) rather than a static
 * "we work worldwide" claim. Returns null if that table is ever emptied
 * out — never a placeholder row standing in for a real client.
 */

import { LiveClock } from "@/components/ui/live-clock";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getClientById, type Client } from "@/data/clients";
import {
  clientsWorldwideOrder,
  getClientTimezone,
  type ClientTimezone,
} from "@/data/client-timezones";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

interface ClientTimezoneEntry {
  client: Client;
  timezone: ClientTimezone;
}

export function ClientsWorldwide() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='client-timezone']",
    duration: duration.slow,
    ease: gsapEasing.entrance,
    y: 16,
    stagger: 0.08,
  });

  const entries = clientsWorldwideOrder
    .map((clientId): ClientTimezoneEntry | undefined => {
      const client = getClientById(clientId);
      const timezone = getClientTimezone(clientId);
      return client && timezone ? { client, timezone } : undefined;
    })
    .filter((entry): entry is ClientTimezoneEntry => Boolean(entry));

  if (entries.length === 0) return null;

  return (
    <section className="py-expansive">
      <Container>
        <SectionHeader eyebrow="Global Reach" title="Clients, worldwide" />

        <div ref={containerRef} className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {entries.map(({ client, timezone }) => (
            <div
              key={client.id}
              data-reveal="client-timezone"
              className="flex flex-col gap-2 border-l border-accent/30 px-4 first:border-l-0"
            >
              <span className="font-heading text-h3 text-text-primary">{client.name}</span>
              <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
                {timezone.label}
              </span>
              <LiveClock
                timeZone={timezone.timeZone}
                className="font-mono text-body text-accent tabular-nums"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
