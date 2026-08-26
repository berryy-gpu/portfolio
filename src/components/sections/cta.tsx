"use client";

/**
 * REBUILD-SPEC.md section 10 — the homepage's final conversion point and
 * the site's second (and final) 3D moment, tier 'high' only. The single
 * filled --accent button on the homepage — reserved for exactly this one
 * moment, per the "accent is an event" rule.
 */

import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { useRef, type RefObject } from "react";

import { TransitionLink } from "@/components/layout/transition-link";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitTextReveal } from "@/components/motion/split-text";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { RotatingBadge } from "@/components/ui/rotating-badge";
import { homepageCtaConfig } from "@/data/homepage-cta";
import { siteConfig } from "@/data/site";
import { useQualityTier } from "@/hooks/use-quality-tier";

const CtaView = dynamic(
  () => import("@/components/three/cta-view").then((mod) => mod.CtaView),
  { ssr: false }
);

export function Cta() {
  const tier = useQualityTier();
  const sectionRef = useRef<HTMLElement>(null);

  if (!homepageCtaConfig.message) return null;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      {tier === "high" && <CtaView track={sectionRef as RefObject<HTMLElement>} />}

      <Container
        width="reading"
        className="relative z-10 flex flex-col items-center gap-10 text-center"
      >
        <RotatingBadge text="Available for new work" glyph={<ArrowUpRight aria-hidden="true" />} />

        <SplitTextReveal
          as="p"
          preset="maskUp"
          className="font-heading text-display-xl tracking-display text-text-primary"
        >
          {homepageCtaConfig.message}
        </SplitTextReveal>

        <Magnetic radius={120} strength={12}>
          <TransitionLink
            href={homepageCtaConfig.cta.href}
            label={homepageCtaConfig.cta.label}
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            {homepageCtaConfig.cta.label}
          </TransitionLink>
        </Magnetic>

        {siteConfig.email && (
          <a
            href={`mailto:${siteConfig.email}`}
            className="group relative font-mono text-caption tracking-caption text-text-secondary uppercase transition-colors hover:text-text-primary"
          >
            {siteConfig.email}
            <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </a>
        )}
      </Container>
    </section>
  );
}
