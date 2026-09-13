"use client";

/**
 * Closing CTA — same shape as HomepageCta/AboutCta (large centered
 * statement + the site's persistent Contact action).
 *
 * `bg-background` + `zIndex.particleOcclusion` (not just `relative`) on
 * the section establish a local stacking context so this section's own
 * local "trygon" particle field replaces the site-wide ambient field
 * within its bounds — see hero.tsx's docstring for the full mechanics.
 */

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { TrygonField } from "@/components/motion/trygon-field";
import { useSound } from "@/components/providers/sound-provider";
import { contactCta } from "@/data/navigation";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing, zIndex } from "@/lib/motion-tokens";

export function ServicesCta() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='services-cta']",
    duration: duration.normal,
    ease: gsapEasing.entrance,
    y: 20,
  });
  const { playClick, playHover } = useSound();

  return (
    <Section
      spacing="cinematic"
      containerWidth="reading"
      className="relative overflow-hidden bg-background"
      style={{ zIndex: zIndex.particleOcclusion }}
      background={<TrygonField id="particle-field-services-cta" />}
    >
      <div
        ref={containerRef}
        className="relative z-10 flex flex-col items-center gap-8 text-center"
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
