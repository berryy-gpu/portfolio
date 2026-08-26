"use client";

/**
 * Once-per-session (sessionStorage) preloader. Progress is real, not a
 * fake timer: gated on document.fonts.ready, the hero video's
 * canplaythrough, and the WebGL scene's first frame — each of the latter
 * two gracefully resolves immediately if its target doesn't exist yet
 * (the current pre-Phase-6/6-5 site has no `video[data-preload-target=
 * 'hero']` element or `window.__webglFirstFrame` promise), so this
 * "just works" once those phases wire the real signals in, no changes
 * needed here.
 *
 * The displayed counter climbs to 90% over exactly the 1.2s minimum
 * duration, then only completes the final stretch to 100% once real
 * readiness (or the 4s hard timeout) is reached — so the wait always
 * feels load-bearing rather than a fixed fake delay. Counter and rule are
 * written straight to the DOM via refs (GSAP tween onUpdate), not React
 * state, since this ticks far too often for a state update per frame.
 */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { useLenis } from "@/components/providers/smooth-scroller";
import { gsap } from "@/lib/gsap";
import { zIndex } from "@/lib/motion-tokens";

const SESSION_KEY = "portfolio:preloader-shown";
const MIN_DURATION_S = 1.2;
const HARD_TIMEOUT_S = 4;

function waitForFontsReady(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  return document.fonts.ready.then(() => undefined);
}

function waitForHeroVideoReady(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  const video = document.querySelector<HTMLVideoElement>(
    "video[data-preload-target='hero']"
  );
  if (!video || video.readyState >= 3) return Promise.resolve();

  return new Promise((resolve) => {
    video.addEventListener("canplaythrough", () => resolve(), { once: true });
    video.addEventListener("error", () => resolve(), { once: true });
  });
}

function waitForWebglReady(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const flag = (window as Window & { __webglFirstFrame?: Promise<void> })
    .__webglFirstFrame;
  return flag ?? Promise.resolve();
}

export function Preloader() {
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();
  const [shouldRender, setShouldRender] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // sessionStorage unavailable (private mode etc.) — show it anyway.
    }
    setShouldRender(true);
  }, []);

  useEffect(() => {
    if (!shouldRender) return;
    const panel = panelRef.current;
    const counter = counterRef.current;
    const rule = ruleRef.current;
    if (!panel || !counter || !rule) return;

    lenis?.stop();

    const setDisplay = (value: number) => {
      counter.textContent = String(Math.round(value)).padStart(2, "0");
      rule.style.transform = `scaleX(${value / 100})`;
    };

    const progress = { value: 0 };
    setDisplay(0);

    const markSessionShown = () => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore
      }
    };

    const finish = () => {
      markSessionShown();

      if (prefersReducedMotion) {
        gsap.to(panel, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            lenis?.start();
            setShouldRender(false);
          },
        });
        return;
      }

      gsap
        .timeline({
          onComplete: () => {
            lenis?.start();
            setShouldRender(false);
          },
        })
        .to(counter, { opacity: 0, duration: 0.3 })
        .to(panel, { clipPath: "inset(0% 0 100% 0)", duration: 0.9, ease: "expo.out" });
    };

    if (prefersReducedMotion) {
      setDisplay(100);
      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        finish();
      };
      Promise.all([waitForFontsReady(), waitForHeroVideoReady(), waitForWebglReady()]).then(
        settle
      );
      const timeoutId = setTimeout(settle, HARD_TIMEOUT_S * 1000);
      return () => clearTimeout(timeoutId);
    }

    let isReady = false;
    let climbDone = false;
    let settled = false;

    const tryFinish = () => {
      if (settled || !isReady || !climbDone) return;
      settled = true;
      clearTimeout(timeoutId);
      gsap.to(progress, {
        value: 100,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: () => setDisplay(progress.value),
        onComplete: finish,
      });
    };

    const climbTween = gsap.to(progress, {
      value: 90,
      duration: MIN_DURATION_S,
      ease: "power1.out",
      onUpdate: () => setDisplay(progress.value),
      onComplete: () => {
        climbDone = true;
        tryFinish();
      },
    });

    const timeoutId = setTimeout(() => {
      isReady = true;
      climbDone = true;
      climbTween.kill();
      tryFinish();
    }, HARD_TIMEOUT_S * 1000);

    Promise.all([waitForFontsReady(), waitForHeroVideoReady(), waitForWebglReady()]).then(() => {
      isReady = true;
      tryFinish();
    });

    return () => {
      clearTimeout(timeoutId);
      climbTween.kill();
      gsap.killTweensOf(progress);
    };
  }, [shouldRender, prefersReducedMotion, lenis]);

  if (!shouldRender) return null;

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      style={{ clipPath: "inset(0% 0 0% 0)", zIndex: zIndex.loading }}
      className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-background"
    >
      <span
        ref={counterRef}
        className="font-mono text-display-xl text-text-tertiary tabular-nums"
      >
        00
      </span>
      <div className="h-px w-40 bg-border">
        <div
          ref={ruleRef}
          className="h-full origin-left bg-accent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}
