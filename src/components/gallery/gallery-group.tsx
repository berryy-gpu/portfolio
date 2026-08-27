"use client";

/**
 * One section on /gallery — either a real client's work or Baran
 * Haider's own content (REBUILD-SPEC.md step 8 + later polish pass):
 * name at text-h2 with a margin index number (matching how /services
 * numbers its blocks), a real derived count line, then that group's
 * media. `id="gallery-{group.id}"` is the anchor the index nav scrolls
 * to. `alternate` toggles a --surface band so consecutive groups don't
 * blend into one undifferentiated wall. `itemStartIndex` is this group's
 * offset into the page's single flat lightbox sequence (images, then
 * reels, then showreels, in that order).
 *
 * "own" groups (Baran Haider's real-reach carousel) render as a plain
 * ordered strip, not the masonry grid client groups use — it's a real
 * 1-through-5 carousel sequence meant to be read left to right, not
 * shuffled into columns.
 */

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { useSound } from "@/components/providers/sound-provider";
import type { ClientId } from "@/data/clients";
import { getClientPosterImage, type GalleryGroup as GalleryGroupData } from "@/data/gallery";
import { GalleryReelCard } from "./gallery-reel-card";
import { GallerySocialGrid } from "./gallery-social-grid";

interface GalleryGroupProps {
  group: GalleryGroupData;
  index: number;
  alternate: boolean;
  itemStartIndex: number;
  onOpenItem: (globalIndex: number) => void;
}

export function GalleryGroup({ group, index, alternate, itemStartIndex, onOpenItem }: GalleryGroupProps) {
  const { id, name, kind, images, reels, showreels, countLine } = group;
  const poster = kind === "client" ? getClientPosterImage(id as ClientId) : undefined;
  const { playClick, playHover } = useSound();
  const reelStartIndex = itemStartIndex + images.length;
  const showreelStartIndex = reelStartIndex + reels.length;

  return (
    <section
      id={`gallery-${id}`}
      data-gallery-section
      className={cn("scroll-mt-24 py-expansive", alternate && "bg-surface")}
    >
      <Container>
        <div className="flex items-start gap-4 pb-10 sm:gap-6">
          <span className="font-mono text-caption tracking-caption text-text-tertiary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-display text-text-primary">{name}</h2>
            {countLine && (
              <p className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
                {countLine}
              </p>
            )}
          </div>
        </div>

        {images.length > 0 && (
          <div className="pb-10">
            {kind === "own" ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                {images.map((image, imageIndex) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => {
                      playClick();
                      onOpenItem(itemStartIndex + imageIndex);
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
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <GallerySocialGrid
                images={images}
                onOpen={(localIndex) => onOpenItem(itemStartIndex + localIndex)}
              />
            )}
          </div>
        )}

        {(reels.length > 0 || showreels.length > 0) && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {reels.map((reel, reelIndex) => (
              <GalleryReelCard
                key={reel.id}
                src={reel.src}
                title={reel.title}
                poster={poster}
                onOpen={() => onOpenItem(reelStartIndex + reelIndex)}
              />
            ))}
            {showreels.map((showreel, showreelIndex) => (
              <GalleryReelCard
                key={showreel.id}
                src={showreel.src}
                title={showreel.title}
                poster={poster}
                onOpen={() => onOpenItem(showreelStartIndex + showreelIndex)}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
