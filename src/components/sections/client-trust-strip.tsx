"use client";

/**
 * Client Trust Strip — no client has a logo asset: Client (clients.ts)
 * has no logo field, and public/images has no logos folder, only
 * per-client social content. Rather than invent logo imagery, this is
 * the graceful fallback: a plain text/wordmark strip of real client
 * names, each linking to its future Client Hub page. No logos or
 * testimonials are fabricated to fill the gap.
 */

import Link from "next/link";

import { Container } from "@/components/ui/container";
import { clients } from "@/data/clients";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function ClientTrustStrip() {
  const containerRef = useScrollReveal<HTMLUListElement>({
    selector: "[data-reveal='trust-client']",
    duration: duration.fast,
    ease: gsapEasing.entrance,
    y: 12,
    stagger: 0.05,
  });

  if (clients.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-border py-comfortable">
      <Container>
        <ul
          ref={containerRef}
          aria-label="Clients"
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {clients.map((client) => (
            <li key={client.id} data-reveal="trust-client">
              <Link
                href={`/work/${client.id}`}
                className="rounded-sm font-heading text-h4 text-text-secondary transition-colors hover:text-text-primary focus-visible:text-text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {client.name}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
