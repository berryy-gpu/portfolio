"use client";

/**
 * REBUILD-SPEC.md section 10 — the homepage's final conversion point. The
 * single filled --accent button on the homepage — reserved for exactly
 * this one moment, per the "accent is an event" rule.
 *
 * Used to also mount CtaView, a tier-'high'-only icosahedron rendered via
 * the shared persistent WebGL canvas (persistent-canvas.tsx). Removed
 * (per explicit decision, not a silent cut) for two independent reasons
 * discovered during the trygon particle work: (1) the opaque
 * `bg-background` + `zIndex.particleOcclusion` wrapper below — needed to
 * occlude the site-wide ParticleField within this section — sits above
 * that shared canvas in the stacking order and made the icosahedron
 * permanently invisible anyway; (2) mounting CtaView at tier 'high' hit a
 * severe, reproducible pre-existing main-thread stall (60-120s during
 * scroll) that predates this change — confirmed against the pre-trygon
 * commit in an isolated worktree. `cta-view.tsx`/`cta-scene.tsx` were
 * deleted as now-fully-unused; the shared canvas itself
 * (persistent-canvas.tsx) stays, since BackdropScene still renders there.
 */

import { ArrowUpRight } from "lucide-react";

import { TransitionLink } from "@/components/layout/transition-link";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitTextReveal } from "@/components/motion/split-text";
import { TrygonField } from "@/components/motion/trygon-field";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { RotatingBadge } from "@/components/ui/rotating-badge";
import { homepageCtaConfig } from "@/data/homepage-cta";
import { siteConfig } from "@/data/site";
import { zIndex } from "@/lib/motion-tokens";

export function Cta() {
  if (!homepageCtaConfig.message) return null;

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: zIndex.particleOcclusion }}
    >
      <div className="absolute inset-0 -z-10 bg-background">
        <TrygonField id="particle-field-cta" />
      </div>

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
            withHoverSound
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
