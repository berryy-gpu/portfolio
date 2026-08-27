"use client";

/**
 * REBUILD-SPEC.md step 8 (+ later polish pass) — the home for social
 * campaigns/reels/showreels that used to live on /work, plus Baran
 * Haider's own content. Grouped by section, not a mixed feed. A sticky
 * project index (GalleryIndexNav) sits under the header; groups alternate
 * --background/--surface bands so scrolling through many of them doesn't
 * read as one undifferentiated wall. One flat lightbox sequence spans
 * every group (images, then reels, then showreels, per group, in
 * getGalleryGroups() order) so arrow-key navigation steps through
 * everything regardless of which group an item came from.
 *
 * A client component so it can own lightbox state — split out from
 * app/gallery/page.tsx, which needs to stay a server component to export
 * page metadata.
 */

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/ui/section";
import { GalleryGroup } from "@/components/gallery/gallery-group";
import { GalleryIndexNav } from "@/components/gallery/gallery-index-nav";
import { GalleryLightbox, type GalleryLightboxItem } from "@/components/gallery/gallery-lightbox";
import { getGalleryGroups, type GalleryGroup as GalleryGroupData } from "@/data/gallery";
import { easing } from "@/lib/motion-tokens";

function buildLightboxItems(groups: GalleryGroupData[]): GalleryLightboxItem[] {
  return groups.flatMap((group) => [
    ...group.images.map((image): GalleryLightboxItem => ({
      type: "image",
      src: image.src,
      alt: image.alt,
      clientName: group.name,
      width: image.width,
      height: image.height,
    })),
    ...group.reels.map((reel): GalleryLightboxItem => ({
      type: "video",
      src: reel.src,
      alt: reel.title,
      clientName: group.name,
    })),
    ...group.showreels.map((showreel): GalleryLightboxItem => ({
      type: "video",
      src: showreel.src,
      alt: showreel.title,
      clientName: group.name,
    })),
  ]);
}

export function GalleryContent() {
  const prefersReducedMotion = useReducedMotion();
  const groups = useMemo(() => getGalleryGroups(), []);
  const lightboxItems = useMemo(() => buildLightboxItems(groups), [groups]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (groups.length === 0) {
    return null;
  }

  let offset = 0;
  const groupOffsets = groups.map((group) => {
    const start = offset;
    offset += group.images.length + group.reels.length + group.showreels.length;
    return start;
  });

  return (
    <>
      <Section>
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easing.hero }}
          className="flex flex-col gap-4"
        >
          <span className="font-mono text-caption tracking-caption text-text-secondary uppercase">
            {String(groups.length).padStart(2, "0")} Sections
          </span>
          <h1 className="font-heading text-display-xl tracking-display text-text-primary">
            Gallery
          </h1>
        </motion.div>
      </Section>

      <GalleryIndexNav groups={groups.map(({ id, name }) => ({ id, name }))} />

      {groups.map((group, groupIndex) => (
        <GalleryGroup
          key={group.id}
          group={group}
          index={groupIndex}
          alternate={groupIndex % 2 === 1}
          itemStartIndex={groupOffsets[groupIndex]}
          onOpenItem={setOpenIndex}
        />
      ))}

      {openIndex !== null && (
        <GalleryLightbox
          items={lightboxItems}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
