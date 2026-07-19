"use client";

/**
 * Motion Design — an editorial mosaic instead of a video grid or a
 * scroll rail. Each client's first reel spans two grid columns (the
 * same fair, deterministic "first reel per client" rule as before) and
 * sits alongside smaller reels at fixed, alternating vertical offsets —
 * `grid-auto-flow: dense` fills the gaps, producing genuine size
 * variation and a staggered, floating composition instead of a uniform
 * wall. True overlapping DOM elements were deliberately avoided (z-index
 * and hover-target conflicts aren't worth the risk without live visual
 * verification) — the "layered depth" comes from the offsets, drop
 * shadows, and the entrance choreography below instead.
 *
 * Entrance is a bespoke local GSAP effect (not the shared
 * useScrollReveal hook — this section wants scale + rotation on top of
 * opacity/y, which the shared hook doesn't do, and extending a hook
 * every other section also depends on wasn't worth it for one section's
 * enhancement). Same central gsap/ScrollTrigger import and
 * gsap.matchMedia reduced-motion pattern as everywhere else.
 *
 * Hover: lift + accent glow (same language as the rest of the page) plus
 * a cursor-tracked 3D tilt — the same technique as the Campaign Gallery
 * tiles, reused here rather than also adding a magnetic pull, which
 * would fight the tilt for the same transform on the same element.
 *
 * The tilt pointermove handler is rAF-throttled (matching
 * CursorSpotlight's pattern). It wasn't originally — see
 * campaign-gallery.tsx's doc comment for the full root-cause writeup;
 * same bug, same fix, confirmed via CPU-throttled Playwright profiling
 * to produce real main-thread long tasks that stall Lenis's scroll
 * interpolation. Not a ScrollTrigger, pinning, or scroll-logic bug.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

import { Section } from "@/components/ui/section";
import { VideoPlayer } from "@/components/ui/video-player";
import { reels } from "@/data/reels";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { duration, gsapEasing } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

/** Each client's first reel (in catalog order) plays larger than the rest. */
function getFeaturedReelIds(): Set<string> {
  const seenClientIds = new Set<string>();
  const featuredIds = new Set<string>();

  for (const reel of reels) {
    if (!seenClientIds.has(reel.clientId)) {
      seenClientIds.add(reel.clientId);
      featuredIds.add(reel.id);
    }
  }

  return featuredIds;
}

const featuredReelIds = getFeaturedReelIds();

/**
 * Fixed, deterministic float offset — no measurement, no randomness per
 * render. Only the smaller (non-featured) cards float; the larger
 * featured cards stay anchored so the size hierarchy stays legible.
 */
function getFloatClass(reelId: string, index: number): string | undefined {
  if (featuredReelIds.has(reelId)) return undefined;
  return index % 2 === 0 ? "lg:-translate-y-6" : "lg:translate-y-6";
}

function ReelCard({
  reelId,
  index,
  children,
}: {
  reelId: string;
  index: number;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isFeatured = featuredReelIds.has(reelId);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const node = rootRef.current;
    if (!node) return;

    let frame: number | null = null;

    const handleMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        node.style.setProperty("--reel-tilt-x", `${(0.5 - py) * 5}deg`);
        node.style.setProperty("--reel-tilt-y", `${(px - 0.5) * 5}deg`);
        frame = null;
      });
    };

    const handleLeave = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      node.style.setProperty("--reel-tilt-x", "0deg");
      node.style.setProperty("--reel-tilt-y", "0deg");
    };

    node.addEventListener("pointermove", handleMove);
    node.addEventListener("pointerleave", handleLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", handleMove);
      node.removeEventListener("pointerleave", handleLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      data-reveal="reel-card"
      style={{
        transform: prefersReducedMotion
          ? undefined
          : "perspective(900px) rotateX(var(--reel-tilt-x, 0deg)) rotateY(var(--reel-tilt-y, 0deg))",
        transition: "transform 300ms ease-out",
      }}
      className={cn(
        "will-change-transform",
        isFeatured ? "col-span-2" : undefined,
        getFloatClass(reelId, index)
      )}
    >
      {children}
    </div>
  );
}

export function MotionDesignWall() {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };
      const cards = container.querySelectorAll<HTMLElement>(
        "[data-reveal='reel-card']"
      );

      if (reduceMotion) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1, rotate: 0 });
        return;
      }

      cards.forEach((card, index) => {
        gsap.set(card, {
          opacity: 0,
          y: 32,
          scale: 0.94,
          rotate: index % 2 === 0 ? -3 : 3,
        });
      });

      ScrollTrigger.batch(cards, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: duration.slow,
            ease: gsapEasing.entrance,
            stagger: 0.12,
            overwrite: true,
          }),
      });
    });

    return () => mm.revert();
  }, []);

  if (reels.length === 0) {
    return null;
  }

  return (
    <Section
      spacing="cinematic"
      header={{ eyebrow: "Motion Design", title: "Reels" }}
    >
      <div
        ref={containerRef}
        className="grid grid-cols-2 gap-8 [grid-auto-flow:dense] sm:grid-cols-3 lg:grid-cols-4 lg:gap-12"
      >
        {reels.map((reel, index) => (
          <ReelCard key={reel.id} reelId={reel.id} index={index}>
            <VideoPlayer
              src={reel.src}
              title={reel.title}
              className="transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-2 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/20"
            />
          </ReelCard>
        ))}
      </div>
    </Section>
  );
}
