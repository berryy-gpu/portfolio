"use client";

/**
 * The `clipReveal` grammar — a clip-path inset wipe while the image
 * counter-scales in from 1.1x to 1x, per REBUILD-SPEC.md's motion
 * vocabulary. Used for case-study/gallery images throughout the rebuild.
 */

import Image, { type ImageProps } from "next/image";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { revealPresets } from "@/lib/reveal-presets";
import { cn } from "@/lib/utils";

interface RevealImageProps extends Omit<ImageProps, "className"> {
  containerClassName?: string;
  imageClassName?: string;
  /** ScrollTrigger `start`. */
  start?: string;
}

export function RevealImage({
  containerClassName,
  imageClassName,
  start = "top 85%",
  alt,
  ...imageProps
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const config = revealPresets.clipReveal;

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    if (prefersReducedMotion) {
      gsap.set(image, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
      return;
    }

    gsap.set(image, {
      clipPath: "inset(0% 0% 100% 0%)",
      scale: config.scaleFrom,
    });

    const tween = gsap.to(image, {
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
      duration: config.duration,
      ease: config.ease,
      scrollTrigger: { trigger: container, start, once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [prefersReducedMotion, start, config.duration, config.ease, config.scaleFrom]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden", containerClassName)}
    >
      <Image
        ref={imageRef}
        alt={alt}
        {...imageProps}
        className={cn("h-full w-full object-cover", imageClassName)}
      />
    </div>
  );
}
