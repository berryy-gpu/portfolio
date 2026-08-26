"use client";

/**
 * Mounts the persistent WebGL canvas (dynamically imported, ssr:false —
 * @react-three/* stays out of every route's initial bundle until this
 * actually renders) whenever WebGL is genuinely available. Quality tier
 * is deliberately NOT part of that decision — see quality-provider.tsx's
 * own docstring for the incident this fixes: the runtime frame-time
 * sampler used to walk the tier down to 'low' within ~2s of mount (it was
 * measuring font load / video decode / shader compile / hydration, the
 * slowest window of any session), and this provider used to unmount the
 * canvas the moment that happened — taking the Hero video and every other
 * 3D moment on the site down with it. Unmounting a canvas is far too
 * destructive a response to one slow measurement window.
 *
 * The tier still matters — it degrades what's rendered INSIDE the canvas
 * (DPR here; postprocessing and scene complexity per-scene, e.g.
 * hero-scene.tsx's `showEffects = tier !== "low"`; the graded-film
 * BackdropScene specifically doesn't render at all below 'high'/'medium'
 * — see persistent-canvas.tsx) — it just can never take the canvas
 * itself away. Only two things do that: WebGL genuinely being
 * unavailable, or prefers-reduced-motion.
 *
 * The backdrop's own 'low'/reduced-motion fallback (a static CSS
 * gradient, BackdropFallback) is independent of whether the canvas is
 * mounted — a weak-but-WebGL-capable device can still have the canvas
 * alive for Hero while the backdrop shader specifically sits out in
 * favour of the static gradient.
 *
 * Also owns `window.__webglFirstFrame`, the promise Preloader (Phase 4)
 * already knows to wait on: created eagerly on mount so it exists before
 * Preloader checks for it, resolved either immediately (the canvas isn't
 * going to mount at all — nothing to wait for) or by the canvas's real
 * onCreated callback.
 *
 * DPR is a canvas-level (not per-View) setting — there's only one shared
 * canvas — so both "dpr 1 on coarse pointers" and "dpr 1 at the 'low'
 * tier" are folded in here globally rather than overridden per-scene,
 * since every 3D moment on the page shares this same renderer.
 */

import dynamic from "next/dynamic";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

import { BackdropFallback } from "@/components/three/backdrop-fallback";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useQualityTier } from "@/hooks/use-quality-tier";
import { useWebglSupported } from "@/hooks/use-webgl-supported";

const PersistentCanvas = dynamic(
  () => import("@/components/three/persistent-canvas").then((mod) => mod.PersistentCanvas),
  { ssr: false }
);

type WebglReadyWindow = Window & {
  __webglFirstFrame?: Promise<void>;
  __resolveWebglFirstFrame?: () => void;
};

function resolveWebglReady() {
  (window as WebglReadyWindow).__resolveWebglFirstFrame?.();
}

export function WebGLProvider({ children }: { children: ReactNode }) {
  const tier = useQualityTier();
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  const prefersReducedMotion = useReducedMotion();
  const webglSupported = useWebglSupported();
  const hasResolvedRef = useRef(false);

  const shouldMount = webglSupported && !prefersReducedMotion;
  const dpr = isCoarsePointer || tier === "low" ? 1 : tier === "high" ? 2 : 1.5;
  const showBackdropFallback = tier === "low" || Boolean(prefersReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as WebglReadyWindow;
    if (!w.__webglFirstFrame) {
      w.__webglFirstFrame = new Promise((resolve) => {
        w.__resolveWebglFirstFrame = resolve;
      });
    }

    // Nothing to wait for if the canvas was never going to mount (no
    // WebGL, or reduced motion) — resolve immediately so Preloader
    // doesn't hang on a signal that will never otherwise arrive.
    if (!shouldMount && !hasResolvedRef.current) {
      hasResolvedRef.current = true;
      resolveWebglReady();
    }
  }, [shouldMount]);

  return (
    <>
      {shouldMount && (
        <PersistentCanvas dpr={dpr} tier={tier} onReady={resolveWebglReady} />
      )}
      {showBackdropFallback && <BackdropFallback />}
      {children}
    </>
  );
}
