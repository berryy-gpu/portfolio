"use client";

/**
 * The homepage's opening scene (REBUILD-SPEC.md section 01). Formerly the
 * site's first of two sanctioned 3D moments — a shader-graded video
 * texture rendered via the persistent WebGL canvas (hero-view.tsx/
 * hero-scene.tsx/hero-material.ts). Removed by explicit request; the
 * background is now plain `bg-background` + noise overlay + this
 * section's own local "trygon" particle field (the poster image that
 * briefly replaced the video is also gone — it referenced a file already
 * deleted from public/, a dead reference only "working" via Next's image-
 * optimizer/browser cache). The CTA scene (Phase 8/10) remains the site's
 * one 3D moment.
 *
 * The background wrapper carries an explicit z-index (zIndex.
 * particleOcclusion, motion-tokens.ts) on top of `relative` — not just
 * `relative` alone — so this section establishes its own local stacking
 * context and paints as one opaque unit above the fixed, site-wide
 * ParticleField (zIndex.particles). Without that explicit z-index, this
 * section's own negatively-z-indexed background div would resolve
 * against the *global* stacking order (where it would lose to the
 * site-wide field) rather than being scoped locally.
 *
 * Cancels the root layout's `pt-16` nav-clearance padding with `-mt-16`
 * so the (transparent-at-scroll-0) fixed nav floats over this section
 * rather than pushing it down — the one section on the site that wants
 * that.
 */

import { useRef, useState, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";

import { Magnetic } from "@/components/motion/magnetic";
import { ScrambleText } from "@/components/motion/scramble-text";
import { SplitTextReveal } from "@/components/motion/split-text";
import { TrygonField } from "@/components/motion/trygon-field";
import { TransitionLink } from "@/components/layout/transition-link";
import { LiveClock } from "@/components/ui/live-clock";
import { useSound } from "@/components/providers/sound-provider";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { contactCta } from "@/data/navigation";
import { heroConfig } from "@/data/hero";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site";
import { gsap } from "@/lib/gsap";
import { zIndex } from "@/lib/motion-tokens";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCENT_WORD = "grow";

const sortedServices = [...services].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

function renderTaglineWithAccent(tagline: string, word: string) {
  const index = tagline.toLowerCase().indexOf(word.toLowerCase());
  if (index === -1) return tagline;

  const before = tagline.slice(0, index);
  const match = tagline.slice(index, index + word.length);
  const after = tagline.slice(index + word.length);

  return (
    <>
      {before}
      <span className="text-accent">{match}</span>
      {after}
    </>
  );
}

// A separate, aria-hidden overlay rather than swapping the h1's own
// content: the h1 is owned by SplitTextReveal's GSAP SplitText mount
// entrance, which rebuilds its DOM via innerHTML during split/revert —
// confirmed live (Chrome, real hover) that a ScrambleText living inside
// that subtree fires its state updates correctly but they never appear
// on screen, because SplitText's revert() re-parses fresh nodes from
// saved HTML rather than restoring the exact instances React committed,
// silently orphaning any fiber still pointing at the pre-split node.
// This overlay sits outside the h1 entirely (a sibling, absolutely
// positioned over it), so GSAP never touches it and React always owns
// it. The h1 keeps the real, always-accessible text and is only visually
// hidden (not unmounted) while the scramble overlay is shown.
function renderScrambledTagline(tagline: string, word: string, active: boolean) {
  const index = tagline.toLowerCase().indexOf(word.toLowerCase());
  if (index === -1) return <ScrambleText text={tagline} active={active} />;

  const before = tagline.slice(0, index);
  const match = tagline.slice(index, index + word.length);
  const after = tagline.slice(index + word.length);

  return (
    <>
      <ScrambleText text={before} active={active} />
      <span className="text-accent">
        <ScrambleText text={match} active={active} />
      </span>
      <ScrambleText text={after} active={active} />
    </>
  );
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const scrollSegmentRef = useRef<HTMLDivElement>(null);
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const { playClick } = useSound();

  const handlePanelMouseEnter = () => setIsPanelHovered(true);
  const handlePanelMouseLeave = () => setIsPanelHovered(false);
  // TransitionLink already plays its own click sound (unconditionally, on
  // every real click — see that file's docstring), so a click landing on
  // one of the CTAs inside this panel would double up with this handler.
  // Only fire for clicks on the panel's own surface (tagline, badges,
  // background), not ones bubbling up from a link/button descendant.
  const handlePanelClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a, button")) return;
    playClick();
  };

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const segment = scrollSegmentRef.current;
    if (!segment) return;

    const tween = gsap.to(segment, {
      y: 24,
      duration: 2.4,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tween.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      className="relative -mt-16 flex min-h-screen flex-col overflow-hidden pt-16"
      style={{ zIndex: zIndex.particleOcclusion }}
    >
      <div className="absolute inset-0 -z-10 bg-background">
        <TrygonField id="particle-field-hero" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-between gap-4 px-6 py-5 sm:gap-6 sm:py-6 md:gap-8 md:px-10 md:py-10">
        <div className="inline-flex w-fit items-center gap-2 rounded-pill border border-border bg-surface/50 px-4 py-2 backdrop-blur-functional">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-success [animation-duration:3s]"
          />
          <span className="font-mono text-caption tracking-caption text-text-secondary uppercase">
            Available for new work
          </span>
        </div>

        <div
          onMouseEnter={handlePanelMouseEnter}
          onMouseLeave={handlePanelMouseLeave}
          onClick={handlePanelClick}
          className={cn(
            "flex max-w-5xl flex-col gap-4 rounded-lg border bg-surface/45 p-4 backdrop-blur-functional transition-[box-shadow,border-color] duration-500 ease-out sm:gap-6 sm:p-6 md:gap-8 md:p-10",
            isPanelHovered
              ? "border-accent shadow-[var(--shadow-glass),0_0_0_1px_var(--accent),0_0_36px_-6px_var(--accent)]"
              : "border-border shadow-glass"
          )}
        >
          <div className="relative">
            <SplitTextReveal
              as="h1"
              preset="maskUp"
              trigger="mount"
              className={cn(
                "font-heading text-display-xxl tracking-display text-text-primary transition-opacity duration-150",
                isPanelHovered && !prefersReducedMotion && "opacity-0"
              )}
            >
              {renderTaglineWithAccent(heroConfig.content.tagline, ACCENT_WORD)}
            </SplitTextReveal>

            {!prefersReducedMotion && (
              <p
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 font-heading text-display-xxl tracking-display text-text-primary transition-opacity duration-150",
                  isPanelHovered ? "opacity-100" : "opacity-0"
                )}
              >
                {renderScrambledTagline(heroConfig.content.tagline, ACCENT_WORD, isPanelHovered)}
              </p>
            )}
          </div>

          <div className="relative max-w-2xl">
            <p
              className={cn(
                "text-small sm:text-body md:text-body-lg text-text-secondary transition-opacity duration-150",
                isPanelHovered && !prefersReducedMotion && "opacity-0"
              )}
            >
              {heroConfig.content.description}
            </p>

            {!prefersReducedMotion && (
              <p
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 text-small sm:text-body md:text-body-lg text-text-secondary transition-opacity duration-150",
                  isPanelHovered ? "opacity-100" : "opacity-0"
                )}
              >
                <ScrambleText text={heroConfig.content.description} active={isPanelHovered} />
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Magnetic>
              <TransitionLink
                href={heroConfig.cta.href}
                label={heroConfig.cta.label}
                withHoverSound
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                {heroConfig.cta.label}
              </TransitionLink>
            </Magnetic>
            <Magnetic>
              <TransitionLink
                href={contactCta.href}
                label={contactCta.label}
                withHoverSound
                className={buttonVariants({ variant: "ghost", size: "lg" })}
              >
                {contactCta.label}
              </TransitionLink>
            </Magnetic>
          </div>

          {sortedServices.length > 0 && (
            <div className="flex gap-x-5 gap-y-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
              {sortedServices.map((service) => (
                <span
                  key={service.id}
                  className="flex shrink-0 items-center gap-2 font-mono text-caption tracking-caption text-text-secondary uppercase"
                >
                  <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {service.title}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          {siteConfig.location && (
            <div className="flex flex-col gap-1 font-mono text-caption tracking-caption text-text-secondary uppercase">
              <span>{siteConfig.location}</span>
              <LiveClock className="text-text-tertiary tabular-nums" />
            </div>
          )}

          <div
            aria-hidden="true"
            className="hidden h-16 w-px overflow-hidden bg-border md:block"
          >
            <div ref={scrollSegmentRef} className="h-10 w-px -translate-y-6 bg-accent" />
          </div>

          <span
            aria-hidden="true"
            className={cn(
              // mr-16 (64px) reserves exactly the sound-toggle's fixed
              // bottom-right footprint (24px inset + 40px width — see
              // sound-toggle.tsx) so this decorative cue never sits under
              // it — confirmed colliding at every common viewport size
              // (not just mobile) before this was added, since both
              // independently anchor to "~24px from the bottom-right
              // corner." Overlap wasn't just visual: at equal effective
              // z-index, DOM order put this span above the button, so it
              // could also swallow taps meant for the toggle.
              "mr-16 rotate-90 font-mono text-caption tracking-caption text-text-secondary uppercase"
            )}
          >
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
