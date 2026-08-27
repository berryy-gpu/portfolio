"use client";

/**
 * A single reel/showreel tile on /gallery — 9:16, muted loop, playsInline,
 * preload="none", posterized (REBUILD-SPEC.md step 8). An
 * IntersectionObserver plays it only while on screen (mirrors
 * motion-reel.tsx's MotionReelClip), and a module-level "currently
 * playing" ref enforces the hard rule that only one gallery video plays
 * at a time across the whole page — when a newly-visible clip starts,
 * whatever was previously playing gets paused first.
 */

import { useEffect, useRef } from "react";

import { useSound } from "@/components/providers/sound-provider";

interface GalleryReelCardProps {
  src: string;
  title: string;
  poster?: string;
  onOpen: () => void;
}

let activeGalleryVideo: HTMLVideoElement | null = null;

export function GalleryReelCard({ src, title, poster, onOpen }: GalleryReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { playClick, playHover } = useSound();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (activeGalleryVideo && activeGalleryVideo !== video) {
            activeGalleryVideo.pause();
          }
          activeGalleryVideo = video;
          video.play().catch(() => {});
        } else {
          video.pause();
          if (activeGalleryVideo === video) {
            activeGalleryVideo = null;
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(wrapper);
    return () => {
      observer.disconnect();
      if (activeGalleryVideo === video) {
        activeGalleryVideo = null;
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative aspect-9/16 w-full overflow-hidden rounded-lg border border-border bg-surface"
    >
      <button
        type="button"
        onClick={() => {
          playClick();
          onOpen();
        }}
        onPointerEnter={playHover}
        aria-label={`Play ${title}`}
        className="absolute inset-0 h-full w-full"
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </button>
    </div>
  );
}
