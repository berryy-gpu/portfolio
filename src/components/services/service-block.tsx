"use client";

/**
 * One service's problem -> approach -> outcome -> relevant work -> CTA,
 * as a tall editorial section with alternating alignment (image/text
 * sides swap by index) and a real image where one exists
 * (services.ts's previewImage — only web-development and
 * social-media-marketing have one; others render text-only rather than
 * an invented image). `id={service.id}` makes this a real anchor target
 * for links like the homepage Capabilities section's `/services#id`.
 */

import Image from "next/image";
import Link from "next/link";

import type { Client } from "@/data/clients";
import type { ServiceDetail } from "@/data/service-detail";
import type { Service } from "@/data/services";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

interface ServiceBlockProps {
  index: number;
  service: Service;
  detail: ServiceDetail;
  relevantClients: Client[];
}

export function ServiceBlock({ index, service, detail, relevantClients }: ServiceBlockProps) {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='service-block']",
    duration: duration.slow,
    ease: gsapEasing.entrance,
    y: 20,
  });

  const isReversed = index % 2 === 1;

  return (
    <div
      id={service.id}
      ref={containerRef}
      className="scroll-mt-24 border-b border-border py-expansive last:border-b-0 md:py-cinematic"
    >
      <div
        data-reveal="service-block"
        className={cn(
          "flex flex-col gap-10 md:flex-row md:gap-16",
          isReversed && "md:flex-row-reverse"
        )}
      >
        <div className="flex flex-1 flex-col gap-6">
          <div>
            <span className="font-mono text-caption tracking-caption text-text-tertiary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-2 break-words font-heading text-h1 text-text-primary">
              {service.title}
            </h2>
          </div>

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
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {service.previewImage && (
          <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-lg border border-border bg-surface md:w-[28rem]">
            <Image
              src={service.previewImage.src}
              alt={service.previewImage.alt}
              fill
              sizes="(min-width: 768px) 448px, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
