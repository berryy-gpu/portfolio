"use client";

import { useEffect, useRef } from "react";
import type Lenis from "lenis";

import { useLenis } from "@/components/providers/smooth-scroller";

/**
 * Page scroll progress (0-1) in a ref — NEVER React state. This fires on
 * every scroll frame; a state update here would re-render the whole tree
 * 60+ times a second. Read `.current` inside your own rAF/useFrame loop
 * (see backdrop-scene.tsx).
 */
export function useScrollProgress() {
  const progress = useRef(0);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = (instance: Lenis) => {
      progress.current = Number.isFinite(instance.progress) ? instance.progress : 0;
    };

    lenis.on("scroll", handleScroll);
    return () => lenis.off("scroll", handleScroll);
  }, [lenis]);

  return progress;
}
