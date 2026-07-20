"use client";

/**
 * Homepage CTA — the page's final conversion point. Restates the Hero's
 * approved tagline as a closing line and pairs it with the site's one
 * persistent Contact action, now in its strongest (filled) button
 * treatment — reserved for this single moment, per the Visual Identity
 * System's restraint principle.
 */

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { homepageCtaConfig } from "@/data/homepage-cta";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

export function HomepageCta() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='cta-content']",
    duration: duration.normal,
    ease: gsapEasing.entrance,
    y: 20,
  });

  if (!homepageCtaConfig.message) {
    return null;
  }

  return (
    <Section
      spacing="cinematic"
      containerWidth="reading"
      contentRef={containerRef}
      contentClassName="flex flex-col items-center gap-8 text-center"
    >
      <p
        data-reveal="cta-content"
        className="font-heading text-h1 tracking-heading break-words text-text-primary md:text-display md:tracking-display"
      >
        {homepageCtaConfig.message}
      </p>
      <Link
        data-reveal="cta-content"
        href={homepageCtaConfig.cta.href}
        className={buttonVariants({ variant: "default", size: "lg" })}
      >
        {homepageCtaConfig.cta.label}
      </Link>
    </Section>
  );
}
