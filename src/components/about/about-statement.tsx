"use client";

/**
 * About's opening — the page's real visual anchor above the fold, per the
 * FIX 4 rebuild: a large portrait (min 480px wide on lg+, real portrait
 * aspect ratio, not a circle/thumbnail) replaces the old 128px avatar
 * circle that buried a 1.8MB source asset at thumbnail size. Two columns
 * on lg+ (statement left, portrait+facts right); single column below lg
 * with the portrait FIRST (`order-1`/`lg:order-2` — DOM order drives
 * mobile stacking, grid placement drives the lg+ layout).
 *
 * clipReveal entrance (RevealImage) plus a grayscale->colour fade on the
 * portrait — opacity only (a static-grayscale overlay crossfading out
 * over a static-colour image beneath), never `filter`, which the
 * performance budget excludes from scroll loops. next/image (via
 * RevealImage) already serves the Phase 1 optimised avif/webp variants
 * of me.png automatically through content negotiation — no need to
 * hardcode a specific format.
 *
 * The grayscale fade is MOUNT-triggered, not scroll-scrubbed — this
 * section sits above the fold, so a scroll-scrub trigger boundary
 * (`start`/`end` relative to scroll position) starts out already behind
 * the initial scroll position and the animation's fromTo state (fully
 * grayscale) never advances. Per this codebase's own convention (scroll-
 * driven animation is for content revealed BY scrolling; above-the-fold,
 * mount-visible content uses mount-driven animation instead — see
 * hero.tsx), this plays once on mount, shortly after RevealImage's own
 * clipReveal entrance would have completed.
 *
 * Facts block: every fact is derived from real data or omitted — never a
 * hardcoded number. Location from siteConfig, years working computed
 * from the real earliest timeline year, client count from clients.ts.
 */

import Image from "next/image";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { RevealImage } from "@/components/motion/reveal-image";
import { Container } from "@/components/ui/container";
import { aboutContent } from "@/data/about";
import { clients } from "@/data/clients";
import { siteConfig } from "@/data/site";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { gsap } from "@/lib/gsap";

function getYearsWorking(): number | null {
  const earliestYear = aboutContent.timeline[0]?.year;
  if (!earliestYear) return null;
  const parsed = Number.parseInt(earliestYear, 10);
  if (Number.isNaN(parsed)) return null;
  return new Date().getFullYear() - parsed;
}

export function AboutStatement() {
  const grayscaleOverlayRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const yearsWorking = getYearsWorking();

  useIsomorphicLayoutEffect(() => {
    const overlay = grayscaleOverlayRef.current;
    if (!overlay) return;

    if (prefersReducedMotion) {
      gsap.set(overlay, { opacity: 0 });
      return;
    }

    gsap.set(overlay, { opacity: 1 });
    const tween = gsap.to(overlay, {
      opacity: 0,
      duration: 1.3,
      delay: 0.6,
      ease: "power1.out",
    });

    return () => {
      tween.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <section className="py-generous md:py-expansive">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(480px,35%)] lg:items-start lg:gap-16">
        <div className="order-2 flex flex-col gap-4 lg:order-1 lg:pt-8">
          <span className="font-mono text-caption tracking-caption text-text-secondary uppercase">
            About
          </span>
          <h1 className="font-heading text-display tracking-display text-text-primary break-words">
            {aboutContent.statement}
          </h1>
        </div>

        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg">
            <RevealImage
              src={siteConfig.avatar}
              alt={siteConfig.name}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              containerClassName="relative h-full w-full"
            />
            <div
              ref={grayscaleOverlayRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 grayscale"
            >
              <Image src={siteConfig.avatar} alt="" fill className="object-cover" />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 font-mono text-caption tracking-caption uppercase">
            {siteConfig.location && (
              <div className="flex flex-col gap-1">
                <dt className="text-text-tertiary">Location</dt>
                <dd className="text-text-primary">{siteConfig.location}</dd>
              </div>
            )}
            {yearsWorking !== null && yearsWorking > 0 && (
              <div className="flex flex-col gap-1">
                <dt className="text-text-tertiary">Years working</dt>
                <dd className="text-text-primary">{yearsWorking}+</dd>
              </div>
            )}
            {clients.length > 0 && (
              <div className="flex flex-col gap-1">
                <dt className="text-text-tertiary">Clients</dt>
                <dd className="text-text-primary">{clients.length}</dd>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <dt className="text-text-tertiary">Availability</dt>
              <dd className="flex items-center gap-2 text-text-primary">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-success [animation-duration:3s]"
                />
                Available
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
