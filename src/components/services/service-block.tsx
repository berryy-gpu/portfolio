"use client";

/**
 * One service's problem → approach → outcome → relevant work → CTA.
 * Rendered once per real service (services.ts), in catalog order.
 * Relevant-work chips only render when real client work actually
 * touches this service's categories — several services (SEO, AI
 * Automation) currently have none, and that's shown by omission, not a
 * "coming soon" placeholder.
 */

import Link from "next/link";

import type { Client } from "@/data/clients";
import type { ServiceDetail } from "@/data/service-detail";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

interface ServiceBlockProps {
  index: number;
  title: string;
  detail: ServiceDetail;
  relevantClients: Client[];
}

export function ServiceBlock({
  index,
  title,
  detail,
  relevantClients,
}: ServiceBlockProps) {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='service-block']",
    duration: duration.slow,
    ease: gsapEasing.entrance,
    y: 20,
  });

  return (
    <div
      ref={containerRef}
      className="border-b border-border py-expansive last:border-b-0 md:py-cinematic"
    >
      <div
        data-reveal="service-block"
        className="flex flex-col gap-8 md:flex-row md:gap-16"
      >
        <div className="shrink-0 md:w-[28rem]">
          <span className="font-mono text-caption tracking-caption text-text-tertiary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="mt-2 break-words font-heading text-h2 text-text-primary md:text-h1">
            {title}
          </h2>
        </div>

        <div className="flex max-w-2xl flex-col gap-6">
          <p className="text-h3 text-text-primary">{detail.problem}</p>
          <p className="text-body-lg text-text-secondary">{detail.approach}</p>
          <p className="border-l-2 border-accent pl-4 text-body text-text-secondary">
            {detail.outcome}
          </p>

          {relevantClients.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2">
              <span className="text-caption tracking-caption text-text-tertiary">
                Relevant work
              </span>
              {relevantClients.map((client, clientIndex) => (
                <span key={client.id} className="text-small text-text-secondary">
                  <Link
                    href={`/work/${client.id}`}
                    className="rounded-sm underline-offset-4 transition-colors hover:text-text-primary hover:underline focus-visible:text-text-primary focus-visible:underline focus-visible:outline-none"
                  >
                    {client.name}
                  </Link>
                  {clientIndex < relevantClients.length - 1 && ","}
                </span>
              ))}
            </div>
          )}

          <Link
            href="/contact"
            className="group inline-flex w-fit items-center gap-2 pt-2 text-small text-text-secondary transition-colors hover:text-text-primary focus-visible:text-text-primary focus-visible:outline-none"
          >
            Talk about this
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
