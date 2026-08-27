"use client";

/**
 * Closing CTA — same shape as the homepage's Cta (large centered
 * statement + the site's one persistent Contact action), using this
 * page's own opening line as its closing bookend rather than duplicating
 * the homepage's tagline. Outline, not filled — the single filled accent
 * button is reserved for the homepage CTA alone.
 */

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { useSound } from "@/components/providers/sound-provider";
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
  const { playClick, playHover } = useSound();

  return (
    <Section spacing="cinematic" containerWidth="reading">
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-8 text-center"
      >
        <p
          data-reveal="about-cta"
          className="font-heading text-display tracking-display break-words text-text-primary"
        >
          {aboutContent.statement}
        </p>
        <Link
          data-reveal="about-cta"
          href={contactCta.href}
          onClick={playClick}
          onPointerEnter={playHover}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {contactCta.label}
        </Link>
      </div>
    </Section>
  );
}
