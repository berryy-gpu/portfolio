"use client";

/**
 * REBUILD-SPEC.md section 06 — pinned horizontal translate through
 * getCraftInMotionMedia()'s curated clips on desktop; native horizontal
 * scroll-snap on touch/low tier (no pin, no GSAP there — ScrollTrigger
 * pin-jacking on touch scrolling is exactly the kind of thing that reads
 * as broken rather than premium). An IntersectionObserver per clip plays
 * only what's actually on screen — several videos decoding at once is a
 * real main-thread stall, not a theoretical one.
 */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { MotionReelLightbox } from "@/components/sections/motion-reel-lightbox";
import { getClientById } from "@/data/clients";
import { getCraftInMotionMedia } from "@/data/craft-in-motion";
import type { Reel } from "@/data/reels";
import type { Showreel } from "@/data/showreels";
import { useDraggableScroll } from "@/hooks/use-draggable-scroll";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useQualityTier } from "@/hooks/use-quality-tier";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface MotionReelClipProps {
  item: Reel | Showreel;
  isDimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onOpen: () => void;
}

function MotionReelClip({ item, isDimmed, onHoverStart, onHoverEnd, onOpen }: MotionReelClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const client = getClientById(item.clientId);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "group relative aspect-9/16 w-[420px] shrink-0 snap-center overflow-hidden rounded-lg bg-surface transition-opacity duration-300",
        isDimmed && "opacity-60"
      )}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Play ${item.title}`}
        className="absolute inset-0 h-full w-full"
      >
        <video
          ref={videoRef}
          src={item.src}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      </button>
      {client && (
        <span className="pointer-events-none absolute bottom-4 left-4 font-mono text-caption tracking-caption text-text-primary uppercase">
          {client.name}
        </span>
      )}
    </div>
  );
}

export function MotionReel() {
  const media = getCraftInMotionMedia();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  const tier = useQualityTier();

  const useNativeScroll = isCoarsePointer || tier === "low" || prefersReducedMotion;
  // Mouse drag-to-scroll only makes sense on the native-scroll branch, and
  // only for fine pointers with motion allowed — coarse pointers already
  // get native touch scrolling untouched, and reduced-motion desktop users
  // get plain wheel/trackpad scroll rather than flick momentum.
  useDraggableScroll(trackRef, {
    enabled: Boolean(useNativeScroll && !isCoarsePointer && !prefersReducedMotion),
  });

  useIsomorphicLayoutEffect(() => {
    if (useNativeScroll) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    const counter = counterRef.current;
    if (!section || !track || !counter) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - section.clientWidth;
      if (distance <= 0) return;

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            const current = Math.min(
              media.length,
              Math.round(self.progress * (media.length - 1)) + 1
            );
            counter.textContent = `${String(current).padStart(2, "0")}/${String(
              media.length
            ).padStart(2, "0")}`;
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, [useNativeScroll, media.length]);

  if (media.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="flex items-center justify-between px-6 py-8 md:px-10">
        <h2 className="font-heading text-h2 text-text-primary">Craft in Motion</h2>
        <span
          ref={counterRef}
          className="font-mono text-caption tracking-caption text-text-tertiary tabular-nums"
        >
          {`01/${String(media.length).padStart(2, "0")}`}
        </span>
      </div>

      <div
        ref={trackRef}
        className={cn(
          "flex gap-6 px-6 pb-10 md:px-10",
          useNativeScroll && "snap-x snap-mandatory overflow-x-auto",
          useNativeScroll &&
            !isCoarsePointer &&
            !prefersReducedMotion &&
            "cursor-grab select-none active:cursor-grabbing"
        )}
      >
        {media.map((item, index) => (
          <MotionReelClip
            key={item.id}
            item={item}
            isDimmed={hoveredIndex !== null && hoveredIndex !== index}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            onOpen={() => setLightboxIndex(index)}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <MotionReelLightbox
          items={media}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
