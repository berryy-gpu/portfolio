"use client";

/**
 * A premium, self-contained "live" website preview: a minimal browser
 * frame around a full-page homepage screenshot that auto-scrolls top to
 * bottom on hover, like someone naturally browsing the page. Owns all of
 * its own behavior — callers only pass a WebsitePreview; no scroll/hover/
 * measurement logic belongs in the section that renders this.
 *
 * The hover sequence is a single timeline: wait, scroll down, pause at
 * the bottom, scroll back up — all timed to feel like unhurried browsing
 * rather than a quick preview flash. Leaving early interrupts gracefully
 * at whatever point the sequence is in and eases back to the top.
 *
 * Only the "full-page" preview type is implemented today. The type field
 * exists so a future preview shape (dashboard, mobile, application) can
 * be added as a new branch here without changing how callers pass data.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { useMediaQuery } from "@/hooks/use-media-query";
import { gsap } from "@/lib/gsap";
import { gsapEasing } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";
import type { WebsitePreview } from "@/data/projects";

interface AnimatedWebsitePreviewProps {
  preview: WebsitePreview;
  className?: string;
}

const HOVER_DELAY_MS = 450;
const MIN_DOWN_DURATION = 2.2;
const MAX_DOWN_DURATION = 6;
const PIXELS_PER_SECOND = 650;
const BOTTOM_PAUSE_S = 0.9;
const RETURN_DURATION_RATIO = 0.65;
const MIN_RETURN_DURATION = 0.8;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function AnimatedWebsitePreview({
  preview,
  className,
}: AnimatedWebsitePreviewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const scrollDistanceRef = useRef(0);
  const lastDownDurationRef = useRef(MIN_DOWN_DURATION);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const returnTweenRef = useRef<gsap.core.Tween | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const canAnimate = canHover && !prefersReducedMotion;

  useEffect(() => {
    const viewport = viewportRef.current;
    const imageWrap = imageWrapRef.current;
    if (!viewport || !imageWrap) return;

    const measure = () => {
      const viewportHeight = viewport.getBoundingClientRect().height;
      const imageHeight = imageWrap.getBoundingClientRect().height;
      scrollDistanceRef.current = Math.max(0, imageHeight - viewportHeight);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    resizeObserver.observe(imageWrap);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      timelineRef.current?.kill();
      returnTweenRef.current?.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (!canAnimate) return;
    const scrollDistance = scrollDistanceRef.current;
    if (scrollDistance <= 0) return;

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    timelineRef.current?.kill();
    returnTweenRef.current?.kill();
    gsap.set(imageWrapRef.current, { y: 0 });

    hoverTimeoutRef.current = setTimeout(() => {
      const downDuration = clamp(
        scrollDistance / PIXELS_PER_SECOND,
        MIN_DOWN_DURATION,
        MAX_DOWN_DURATION
      );
      lastDownDurationRef.current = downDuration;
      const upDuration = Math.max(
        downDuration * RETURN_DURATION_RATIO,
        MIN_RETURN_DURATION
      );

      const tl = gsap.timeline();
      tl.to(imageWrapRef.current, {
        y: -scrollDistance,
        duration: downDuration,
        ease: gsapEasing.entrance,
      });
      tl.to(
        imageWrapRef.current,
        {
          y: 0,
          duration: upDuration,
          ease: gsapEasing.exit,
        },
        `+=${BOTTOM_PAUSE_S}`
      );

      timelineRef.current = tl;
    }, HOVER_DELAY_MS);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (!canAnimate) return;

    timelineRef.current?.kill();

    const returnDuration = Math.max(
      lastDownDurationRef.current * RETURN_DURATION_RATIO,
      MIN_RETURN_DURATION
    );

    returnTweenRef.current?.kill();
    returnTweenRef.current = gsap.to(imageWrapRef.current, {
      y: 0,
      duration: returnDuration,
      ease: gsapEasing.exit,
      overwrite: true,
    });
  };

  return (
    <div
      ref={rootRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-surface",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-error/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
        </div>
        <div className="flex-1 truncate rounded-pill bg-background px-3 py-1 text-center font-mono text-caption text-text-tertiary">
          {preview.domain}
        </div>
      </div>

      <div
        ref={viewportRef}
        className="relative aspect-[16/10] w-full overflow-hidden bg-background"
      >
        <div
          ref={imageWrapRef}
          className="absolute inset-x-0 top-0 will-change-transform"
        >
          <Image
            src={preview.image.src}
            alt={preview.image.alt}
            width={preview.image.width}
            height={preview.image.height}
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
