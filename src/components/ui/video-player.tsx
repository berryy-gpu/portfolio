"use client";

/**
 * Muted autoplay-in-view video, per the approved Craft in Motion
 * accessibility spec: playback starts muted, plays only while in view,
 * and pauses out of view — the same behavior for reduced-motion users,
 * since the only motion-sensitive mechanic (scroll-scrubbed playback)
 * isn't implemented here. A visible, keyboard-accessible control is the
 * only way to unmute; there is no unmuted autoplay.
 */

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type VideoAspectRatio = "9/16" | "16/9";

const aspectRatioClasses: Record<VideoAspectRatio, string> = {
  "9/16": "aspect-[9/16]",
  "16/9": "aspect-video",
};

interface VideoPlayerProps {
  src: string;
  title: string;
  className?: string;
  /** Defaults to the reel-native 9:16 portrait Craft in Motion uses. */
  aspectRatio?: VideoAspectRatio;
}

export function VideoPlayer({
  src,
  title,
  className,
  aspectRatio = "9/16",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: containerRef, isInView } = useInView<HTMLDivElement>(0.5);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-lg border border-border bg-surface",
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      <video
        ref={videoRef}
        src={src}
        muted={isMuted}
        loop
        playsInline
        preload="none"
        aria-label={title}
        className="h-full w-full object-cover"
      />

      <button
        type="button"
        onClick={() => setIsMuted((muted) => !muted)}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        aria-pressed={!isMuted}
        className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/70 text-text-primary backdrop-blur-functional transition-colors hover:bg-background/90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
