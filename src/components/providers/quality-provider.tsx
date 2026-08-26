"use client";

/**
 * Detects a coarse render-quality tier once on mount from device cores/
 * memory and pointer type, then — production only — samples real frame
 * times and drops one tier if the device can't keep up. This tier degrades
 * what's rendered (DPR, postprocessing, scene complexity); as of the
 * webgl-provider.tsx fix, it must never be used to unmount the WebGL
 * canvas itself — that was the actual bug being fixed here (see FIX 1
 * commit notes): a single slow measurement window during font load /
 * video decode / shader compile / hydration walked the tier all the way
 * down to 'low' within ~2s and it never recovered, taking the entire
 * Hero video and every other 3D moment with it.
 *
 * `prefers-reduced-motion: reduce` always forces 'low', full stop — no
 * amount of hardware headroom overrides a user's stated preference.
 *
 * Returns 'low' during SSR and until the first client effect runs, so
 * nothing that reads this ever hydration-mismatches (same pattern as
 * use-media-query.ts: default to the safe value, upgrade after mount).
 *
 * Runtime sampler, rewritten:
 *   - Skipped entirely outside production — in dev, Strict Mode's double
 *     render and the absence of minification make every frame look slow;
 *     that's dev-server overhead, not a signal about the site.
 *   - Doesn't start until 4s after mount, so it never measures font load,
 *     initial video decode, shader compile, or hydration — the
 *     legitimately slowest window of any session, and not representative
 *     of steady-state performance.
 *   - Budget raised from 22ms to 30ms per frame (median over a 60-frame
 *     window).
 *   - Requires 3 CONSECUTIVE over-budget windows (180 frames) before
 *     acting — one bad window (a GC pause, a tab switch) is noise, not a
 *     verdict.
 *   - Floors at 'medium'. The sampler can never push the tier to 'low' —
 *     'low' is reserved for prefers-reduced-motion and for genuinely weak
 *     devices caught at initial detection, never for "this session
 *     happened to stutter once."
 *   - Stops permanently, for the rest of the session, the moment it
 *     downgrades once (tracked in a ref, independent of tier changing and
 *     re-running the effect). There's no reason to keep a rAF loop alive
 *     after it's already made its one allowed call.
 *   - Pauses (not just skips a beat — actually waits) while the tab is
 *     hidden, so a backgrounded tab's throttled rAF cadence never reads
 *     as a slow device.
 */

import {
  createContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type QualityTier = "high" | "medium" | "low";

const TIER_ORDER: QualityTier[] = ["low", "medium", "high"];
const FRAME_SAMPLE_SIZE = 60;
const FRAME_TIME_BUDGET_MS = 30;
const SAMPLING_START_DELAY_MS = 4000;
const CONSECUTIVE_OVER_BUDGET_REQUIRED = 3;
const MIN_RUNTIME_TIER_INDEX = TIER_ORDER.indexOf("medium");

export const QualityContext = createContext<QualityTier>("low");

function detectInitialTier(): QualityTier {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "low";
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  const rawMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  // navigator.deviceMemory doesn't exist in Firefox or Safari. Falling
  // back to a number here (as this used to) means "unknown" silently
  // reads as "low-ish", which permanently disqualifies every Safari/
  // Firefox user from 'high' regardless of their real hardware. Treat it
  // as genuinely unknown and decide on cores + pointer type alone.
  if (rawMemory === undefined) {
    if (cores >= 8 && !isCoarsePointer) return "high";
    if (cores >= 4) return "medium";
    return "low";
  }

  if (cores >= 8 && rawMemory >= 8 && !isCoarsePointer) return "high";
  if (cores >= 4 && rawMemory >= 4) return "medium";
  return "low";
}

/** One step down, floored at 'medium' — the runtime sampler's only move. */
function downgrade(tier: QualityTier): QualityTier {
  const index = TIER_ORDER.indexOf(tier);
  return TIER_ORDER[Math.max(MIN_RUNTIME_TIER_INDEX, index - 1)];
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function QualityProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<QualityTier>("low");
  const hasDowngradedRef = useRef(false);

  useEffect(() => {
    setTier(detectInitialTier());
  }, []);

  useEffect(() => {
    if (tier === "low") return;
    if (hasDowngradedRef.current) return;
    if (process.env.NODE_ENV !== "production") return;

    let cancelled = false;
    let startTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let frameId: number | null = null;

    const startSampling = () => {
      if (cancelled) return;

      const samples: number[] = [];
      let lastTime = performance.now();
      let consecutiveOverBudget = 0;

      const sample = (time: number) => {
        if (document.hidden) {
          // Don't let a throttled background tab's frame cadence read as
          // a slow device — reset the window and keep waiting.
          lastTime = time;
          samples.length = 0;
          frameId = requestAnimationFrame(sample);
          return;
        }

        samples.push(time - lastTime);
        lastTime = time;

        if (samples.length >= FRAME_SAMPLE_SIZE) {
          consecutiveOverBudget =
            median(samples) > FRAME_TIME_BUDGET_MS ? consecutiveOverBudget + 1 : 0;
          samples.length = 0;

          if (consecutiveOverBudget >= CONSECUTIVE_OVER_BUDGET_REQUIRED) {
            hasDowngradedRef.current = true;
            setTier((current) => downgrade(current));
            return;
          }
        }

        frameId = requestAnimationFrame(sample);
      };

      frameId = requestAnimationFrame(sample);
    };

    startTimeoutId = setTimeout(startSampling, SAMPLING_START_DELAY_MS);

    return () => {
      cancelled = true;
      if (startTimeoutId !== null) clearTimeout(startTimeoutId);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [tier]);

  return (
    <QualityContext.Provider value={tier}>{children}</QualityContext.Provider>
  );
}
