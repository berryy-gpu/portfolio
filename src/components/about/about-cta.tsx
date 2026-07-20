"use client";

/**
 * Closing CTA — same shape as the homepage's HomepageCta (large
 * centered statement + the site's one persistent Contact action), using
 * this page's own opening line as its closing bookend rather than
 * duplicating the homepage's tagline.
 */

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { aboutContent } from "@/data/about";
import { contactCta } from "@/data/navigation";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function AboutCta() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='about-cta']",
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
          data-reveal="about-cta"
          className="font-heading text-h1 tracking-heading break-words text-text-primary md:text-display md:tracking-display"
        >
          {aboutContent.statement}
        </p>
        <Link
          data-reveal="about-cta"
          href={contactCta.href}
          className={buttonVariants({ variant: "default", size: "lg" })}
        >
          {contactCta.label}
        </Link>
      </div>
    </Section>
  );
}
