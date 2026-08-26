"use client";

/**
 * Closing CTA — same shape as HomepageCta/AboutCta (large centered
 * statement + the site's persistent Contact action).
 */

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { contactCta } from "@/data/navigation";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function ServicesCta() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='services-cta']",
    duration: duration.normal,
    ease: gsapEasing.entrance,
    y: 20,
  });

  return (
    <Section spacing="cinematic" containerWidth="reading">
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-8 text-center"
      >
        <p
          data-reveal="services-cta"
          className="font-heading text-display tracking-display break-words text-text-primary"
        >
          Not sure which one fits? Let&apos;s figure it out together.
        </p>
        <Link
          data-reveal="services-cta"
          href={contactCta.href}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {contactCta.label}
        </Link>
      </div>
    </Section>
  );
}
