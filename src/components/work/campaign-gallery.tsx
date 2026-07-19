"use client";

/**
 * Creative Campaigns — the Work page's hero section and exhibition
 * piece. All 34 real social post images, none hidden, none cropped to a
 * uniform ratio. CSS multi-column masonry is the technical mechanism
 * (no JS layout library), interleaved across clients in a deliberate
 * round-robin rather than left in raw per-client order.
 *
 * Each tile gets a cursor-tracked spotlight and a subtle 3D tilt on
 * hover — the gallery's signature interaction, applied once here rather
 * than sprinkled everywhere else on the page. Per-tile scroll-linked
 * parallax was deliberately skipped: 34 simultaneous scrub ScrollTriggers
 * is a real jank risk for a marginal gain over the scroll-reveal
 * choreography already doing the work of "constantly discover something
 * new while scrolling." A few tiles get a small deterministic vertical
 * offset for asymmetry — fixed per tile (not random per render), so
 * layout never shifts between renders.
 *
 * The tilt/spotlight pointermove handler is rAF-throttled (matching
 * CursorSpotlight's pattern). It wasn't originally — calling
 * getBoundingClientRect() synchronously on every raw pointermove event,
 * across up to 34 tiles, was confirmed (via CPU-throttled Playwright
 * profiling) to produce real main-thread long tasks (500ms+). That
 * stalls the same gsap.ticker-driven loop that drives Lenis's scroll
 * interpolation (smooth-scroller.tsx runs with lagSmoothing(0), so nothing
 * compensates for a dropped frame) — the actual cause of the reported
 * scroll freeze/jump, not a scroll-logic or ScrollTrigger bug.
 */

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { Section } from "@/components/ui/section";
import { getClientById, type ClientId } from "@/data/clients";
import { socialCampaigns, type SocialImage } from "@/data/socialCampaigns";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

interface GalleryTile {
  id: string;
  clientId: ClientId;
  image: SocialImage;
}

function interleaveByClient(): GalleryTile[] {
  const queues = socialCampaigns.map((campaign) => ({
    clientId: campaign.clientId,
    images: [...campaign.images],
  }));

  const tiles: GalleryTile[] = [];
  let tookAny = true;

  while (tookAny) {
    tookAny = false;
    for (const queue of queues) {
      const image = queue.images.shift();
      if (image) {
        tiles.push({ id: image.src, clientId: queue.clientId, image });
        tookAny = true;
      }
    }
  }

  return tiles;
}

/** Every 5th tile lifts slightly — a small, fixed, non-random offset. */
function getOffsetClass(index: number): string | undefined {
  return index % 5 === 2 ? "lg:-translate-y-6" : undefined;
}

function CampaignTile({ tile, index }: { tile: GalleryTile; index: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const client = getClientById(tile.clientId);

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
        const tiltX = (0.5 - py) * 6;
        const tiltY = (px - 0.5) * 6;

        node.style.setProperty("--tile-spot-x", `${px * 100}%`);
        node.style.setProperty("--tile-spot-y", `${py * 100}%`);
        node.style.setProperty("--tile-tilt-x", `${tiltX}deg`);
        node.style.setProperty("--tile-tilt-y", `${tiltY}deg`);
        frame = null;
      });
    };

    const handleLeave = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      node.style.setProperty("--tile-tilt-x", "0deg");
      node.style.setProperty("--tile-tilt-y", "0deg");
      node.style.setProperty("--tile-spot-opacity", "0");
    };

    const handleEnter = () => {
      node.style.setProperty("--tile-spot-opacity", "1");
    };

    node.addEventListener("pointermove", handleMove);
    node.addEventListener("pointerenter", handleEnter);
    node.addEventListener("pointerleave", handleLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", handleMove);
      node.removeEventListener("pointerenter", handleEnter);
      node.removeEventListener("pointerleave", handleLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      data-reveal="campaign-tile"
      style={{
        transform: prefersReducedMotion
          ? undefined
          : "perspective(800px) rotateX(var(--tile-tilt-x, 0deg)) rotateY(var(--tile-tilt-y, 0deg))",
        transition: "transform 300ms ease-out",
      }}
      className={cn(
        "group relative mb-6 break-inside-avoid overflow-hidden rounded-lg border border-border bg-surface will-change-transform lg:mb-8",
        getOffsetClass(index)
      )}
    >
      <Image
        src={tile.image.src}
        alt={tile.image.alt}
        width={tile.image.width}
        height={tile.image.height}
        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
        className="h-auto w-full"
      />

      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          style={{
            opacity: "var(--tile-spot-opacity, 0)",
            background:
              "radial-gradient(circle at var(--tile-spot-x, 50%) var(--tile-spot-y, 50%), color-mix(in oklch, var(--color-accent) 25%, transparent), transparent 60%)",
          }}
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        />
      )}

      {client && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-small text-text-primary">{client.name}</span>
        </div>
      )}
    </div>
  );
}

export function CampaignGallery() {
  const tiles = useMemo(() => interleaveByClient(), []);

  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='campaign-tile']",
    duration: duration.normal,
    ease: gsapEasing.entrance,
    y: 24,
    stagger: 0.06,
  });

  if (tiles.length === 0) {
    return null;
  }

  return (
    <Section
      spacing="cinematic"
      header={{
        eyebrow: "Creative Campaigns",
        title: "A wall of real work",
        description:
          "Every published post shown here — nothing hidden, nothing staged.",
      }}
    >
      <div
        ref={containerRef}
        className="columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8"
      >
        {tiles.map((tile, index) => (
          <CampaignTile key={tile.id} tile={tile} index={index} />
        ))}
      </div>
    </Section>
  );
}
