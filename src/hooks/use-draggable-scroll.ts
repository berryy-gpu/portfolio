"use client";

/**
 * Adds mouse-drag-to-scroll with momentum to a horizontally scrollable
 * container — REBUILD-SPEC.md 3e. Fine pointers only: a `pointerType ===
 * "touch"` pointerdown is ignored entirely so the browser's own native
 * touch scrolling handles it — drag-jacking touch scroll is exactly the
 * kind of thing that reads as broken, not premium, and the caller should
 * gate `enabled` on `prefers-reduced-motion` itself (native
 * `overflow-x-auto` scroll is the correct static fallback there).
 *
 * A release under 5px of total pointer movement is treated as a click,
 * not a drag: the click that follows pointerup is left alone. Past that
 * threshold, the *next* click is swallowed (capture-phase, one-shot) —
 * without it, a fast drag can leave whatever button is now under the
 * released cursor absorbing a click it never meant to receive, since
 * scrollLeft moved the content rather than the pointer.
 */

import { useEffect } from "react";
import type { RefObject } from "react";

const CLICK_THRESHOLD_PX = 5;
const MOMENTUM_DECAY = 0.95;
const MOMENTUM_MIN_VELOCITY = 0.1;

interface UseDraggableScrollOptions {
  enabled?: boolean;
}

export function useDraggableScroll<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  { enabled = true }: UseDraggableScrollOptions = {}
) {
  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;

    let isDragging = false;
    let suppressNextClick = false;
    let startX = 0;
    let startScrollLeft = 0;
    let totalMovement = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let momentumFrameId: number | null = null;

    const stopMomentum = () => {
      if (momentumFrameId !== null) {
        cancelAnimationFrame(momentumFrameId);
        momentumFrameId = null;
      }
    };

    const runMomentum = () => {
      velocity *= MOMENTUM_DECAY;
      if (Math.abs(velocity) < MOMENTUM_MIN_VELOCITY) {
        momentumFrameId = null;
        el.style.scrollSnapType = "";
        return;
      }
      el.scrollLeft -= velocity;
      momentumFrameId = requestAnimationFrame(runMomentum);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      stopMomentum();
      // CSS scroll-snap fights a manually-driven scrollLeft — each frame
      // of drag/momentum reads as a settled scroll and the browser yanks
      // back toward the nearest snap point mid-gesture. Suspended for the
      // duration of the drag + its momentum tail, restored once it settles.
      el.style.scrollSnapType = "none";
      isDragging = true;
      totalMovement = 0;
      startX = event.clientX;
      lastX = event.clientX;
      lastTime = performance.now();
      velocity = 0;
      startScrollLeft = el.scrollLeft;
      el.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging) return;
      event.preventDefault();

      const now = performance.now();
      const dt = Math.max(now - lastTime, 1);
      velocity = ((event.clientX - lastX) / dt) * 16;
      lastX = event.clientX;
      lastTime = now;

      const movedFromStart = event.clientX - startX;
      totalMovement = Math.max(totalMovement, Math.abs(movedFromStart));
      el.scrollLeft = startScrollLeft - movedFromStart;
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      el.releasePointerCapture(event.pointerId);

      if (totalMovement >= CLICK_THRESHOLD_PX) {
        suppressNextClick = true;
        runMomentum();
      } else {
        el.style.scrollSnapType = "";
      }
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      event.preventDefault();
      event.stopPropagation();
    };

    el.addEventListener("pointerdown", handlePointerDown);
    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerup", handlePointerUp);
    el.addEventListener("pointercancel", handlePointerUp);
    el.addEventListener("click", handleClickCapture, true);

    return () => {
      stopMomentum();
      el.style.scrollSnapType = "";
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerup", handlePointerUp);
      el.removeEventListener("pointercancel", handlePointerUp);
      el.removeEventListener("click", handleClickCapture, true);
    };
  }, [containerRef, enabled]);
}
