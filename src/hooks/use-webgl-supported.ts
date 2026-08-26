"use client";

import { useEffect, useState } from "react";

let cachedSupport: boolean | null = null;

function detectWebglSupport(): boolean {
  if (cachedSupport !== null) return cachedSupport;

  try {
    const canvas = document.createElement("canvas");
    cachedSupport = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    cachedSupport = false;
  }

  return cachedSupport;
}

/**
 * Real WebGL availability — a genuine capability check, not a quality-tier
 * heuristic. Detected once per session and cached at module scope (the
 * fact doesn't change mid-session). SSR-safe: returns false until the
 * first client effect runs, same pattern as use-media-query.ts.
 *
 * This is the one thing (besides prefers-reduced-motion) allowed to stop
 * the persistent WebGL canvas from mounting at all — see
 * webgl-provider.tsx. A low quality tier is not a reason to unmount it.
 */
export function useWebglSupported(): boolean {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(detectWebglSupport());
  }, []);

  return supported;
}
