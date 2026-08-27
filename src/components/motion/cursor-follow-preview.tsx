"use client";

/**
 * A floating preview that follows the cursor with damped position and a
 * velocity-derived tilt (capped at 6deg), revealed via a clip-path
 * expanding from its own center. Shared by Capabilities (REBUILD-SPEC.md
 * section 05) and /work's client rows, which the spec explicitly says
 * reuse "the cursor-following preview primitive from section 05" — one
 * implementation, not two.
 *
 * The parent list owns which item is active (`image`/`video`, or null
 * when nothing's hovered / a row has no preview) and renders exactly one
 * of these; this component only handles the following/tilt/reveal
 * mechanics. Callers should only mount this at all on hover-capable,
 * non-reduced-motion viewports — it has no gating of its own.
 *
 * `video` takes a real muted/looping clip (client rows only, per
 * REBUILD-SPEC.md 3f — gated by the caller on tier !== 'low' since only
 * eternal and friends-perk-cafe have real clips to show) and falls back
 * to its own `poster` while nothing is playing. Only one preview video
 * plays at a time across the page — a module-level ref pauses whichever
 * one was previously active before a new one starts.
 *
 * The follow/tilt tick rides the shared gsap.ticker rather than its own
 * requestAnimationFrame loop — see magnetic.tsx's docstring for why.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { damp } from "@/lib/utils";
import { zIndex } from "@/lib/motion-tokens";

export interface CursorFollowPreviewImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface CursorFollowPreviewVideo {
  src: string;
  poster: string;
  alt: string;
}

interface CursorFollowPreviewProps {
  image: CursorFollowPreviewImage | null;
  video?: CursorFollowPreviewVideo | null;
}

const POSITION_SMOOTHING = 22;
const TILT_SMOOTHING = 8;
const MAX_TILT_DEG = 6;

/** The one preview video allowed to play at a time, across every mounted
 *  CursorFollowPreview instance. */
let activePreviewVideo: HTMLVideoElement | null = null;

export function CursorFollowPreview({ image, video = null }: CursorFollowPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const lastTargetX = useRef(0);
  const tilt = useRef(0);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !video) return;

    if (activePreviewVideo && activePreviewVideo !== videoEl) {
      activePreviewVideo.pause();
    }
    activePreviewVideo = videoEl;
    videoEl.play().catch(() => {});

    return () => {
      videoEl.pause();
      if (activePreviewVideo === videoEl) {
        activePreviewVideo = null;
      }
    };
    // Re-run only when the actual clip changes, not on every re-render —
    // callers pass a fresh `video` object literal each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.src]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
    };

    window.addEventListener("pointermove", handlePointerMove);

    const tick = (_time: number, deltaMs: number) => {
      const delta = deltaMs / 1000;

      const rawVelocity = (target.current.x - lastTargetX.current) / Math.max(delta, 0.001);
      lastTargetX.current = target.current.x;
      const targetTilt = Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, rawVelocity * 0.02));

      current.current.x = damp(current.current.x, target.current.x, POSITION_SMOOTHING, delta);
      current.current.y = damp(current.current.y, target.current.y, POSITION_SMOOTHING, delta);
      tilt.current = damp(tilt.current, targetTilt, TILT_SMOOTHING, delta);

      const wrapper = wrapperRef.current;
      if (wrapper) {
        wrapper.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%) rotate(${tilt.current}deg)`;
      }
    };

    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{ zIndex: zIndex.elevated }}
      className="pointer-events-none fixed top-0 left-0 h-[240px] w-[340px] overflow-hidden rounded-md"
    >
      <div
        className="h-full w-full transition-[clip-path] duration-[400ms] ease-out"
        style={{
          clipPath: video || image ? "circle(75% at center)" : "circle(0% at center)",
        }}
      >
        {video ? (
          <video
            ref={videoRef}
            key={video.src}
            src={video.src}
            poster={video.poster}
            aria-label={video.alt}
            muted
            loop
            playsInline
            preload="none"
            className="h-full w-full object-cover"
          />
        ) : (
          image && (
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="h-full w-full object-cover"
            />
          )
        )}
      </div>
    </div>
  );
}
