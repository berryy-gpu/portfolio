"use client";

/**
 * One client's social images on /gallery — masonry, clipReveal staggered
 * BY COLUMN (REBUILD-SPEC.md step 8), same mechanic as
 * client-social-gallery.tsx's per-client masonry on /work/[clientId], but
 * click-to-open instead of static, and without that component's own
 * eyebrow/title header (GalleryClientGroup supplies its own).
 *
 * WARNING this data crosses: public/images/social/"friends perk" has a
 * literal space in the folder name plus inconsistent casing and mixed
 * .jpg/.jpeg — the paths are stored correctly as-is and next/image
 * encodes them correctly when building the optimized image URL, so no
 * manual encoding here (double-encoding would break it).
 */

import Image from "next/image";
import { useRef } from "react";

import { useSound } from "@/components/providers/sound-provider";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { revealPresets } from "@/lib/reveal-presets";

const COLUMN_COUNT = 3;

interface GallerySocialGridImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface GallerySocialGridProps {
  images: GallerySocialGridImage[];
  onOpen: (index: number) => void;
}

export function GallerySocialGrid({ images, onOpen }: GallerySocialGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = revealPresets.clipReveal;
  const { playClick, playHover } = useSound();

  const columns = Array.from({ length: COLUMN_COUNT }, (_, columnIndex) =>
    images
      .map((image, index) => ({ image, index }))
      .filter((_, imageIndex) => imageIndex % COLUMN_COUNT === columnIndex)
  );

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };
      const columnEls = container.querySelectorAll<HTMLElement>("[data-gallery-column]");

      columnEls.forEach((columnEl, columnIndex) => {
        const tiles = columnEl.querySelectorAll<HTMLElement>("[data-gallery-tile]");
        if (tiles.length === 0) return;

        if (reduceMotion) {
          gsap.set(tiles, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
          return;
        }

        gsap.set(tiles, { clipPath: "inset(0% 0% 100% 0%)", scale: config.scaleFrom });

        ScrollTrigger.batch(tiles, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              duration: config.duration,
              ease: config.ease,
              stagger: 0.08,
              delay: columnIndex * 0.1,
            }),
        });
      });
    });

    return () => mm.revert();
  }, [images.length, config.duration, config.ease, config.scaleFrom]);

  if (images.length === 0) return null;

  return (
    <div ref={containerRef} className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
      {columns.map((columnTiles, columnIndex) => (
        <div key={columnIndex} data-gallery-column className="flex flex-col gap-6 lg:gap-8">
          {columnTiles.map(({ image, index }) => (
            <button
              key={image.src}
              type="button"
              data-gallery-tile
              onClick={() => {
                playClick();
                onOpen(index);
              }}
              onPointerEnter={playHover}
              aria-label={image.alt}
              className="group relative overflow-hidden rounded-lg border border-border bg-surface"
              style={{ aspectRatio: `${image.width} / ${image.height}` }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
