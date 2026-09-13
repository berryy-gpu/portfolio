"use client";

/**
 * Closing CTA for /work — same shape as ServicesCta/AboutCta (large
 * centered statement + a single outline action), with its own copy
 * rather than reusing the shared `contactCta` nav label: "Start a
 * Project" reads better as a conversion prompt here than "Contact"
 * does, even though both point at the same /contact destination.
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
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing, zIndex } from "@/lib/motion-tokens";

export function WorkCta() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='work-cta']",
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
      background={<TrygonField id="particle-field-work-cta" />}
    >
      <div
        ref={containerRef}
        className="relative z-10 flex flex-col items-center gap-8 text-center"
      >
        <p
          data-reveal="work-cta"
          className="font-heading text-display tracking-display break-words text-text-primary"
        >
          Let&apos;s build a website that doesn&apos;t just look good — it works.
        </p>
        <Link
          data-reveal="work-cta"
          href="/contact"
          onClick={playClick}
          onPointerEnter={playHover}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Start a Project
        </Link>
      </div>
    </Section>
  );
}
