"use client";

/**
 * Orchestrates App Router page transitions without AnimatePresence (which
 * doesn't reliably fire on route exit in the App Router). This owns the
 * state machine and the router/Lenis coordination; the actual overlay DOM
 * and GSAP wipe animations live in layout/page-transition.tsx, which
 * reacts to `phase` and reports back via `notifyCoverComplete`/
 * `notifyRevealComplete` — the two files hand off through this context
 * rather than either owning both logic and DOM.
 *
 * Sequence (REBUILD-SPEC.md): TransitionLink intercepts a click ->
 * beginTransition sets phase "covering" -> PageTransition plays the wipe-in
 * and calls notifyCoverComplete -> lenis.stop() + router.push() -> once
 * the new route's pathname actually matches, scrollTo(0, {immediate}) and
 * phase "revealing" -> PageTransition plays the wipe-out and calls
 * notifyRevealComplete -> lenis.start(), phase back to "idle".
 *
 * Failsafe: if the pathname never matches within 2s (a hung navigation),
 * phase is forced to "revealing" anyway so the cover animates back out
 * instead of leaving the screen stuck — a stuck overlay is a dead site.
 */

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useLenis } from "@/components/providers/smooth-scroller";
import { useSound } from "@/components/providers/sound-provider";

export type TransitionPhase = "idle" | "covering" | "covered" | "revealing";

interface TransitionContextValue {
  phase: TransitionPhase;
  destinationLabel: string;
  beginTransition: (href: string, label: string) => void;
  notifyCoverComplete: () => void;
  notifyRevealComplete: () => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("usePageTransition must be used within TransitionProvider");
  }
  return ctx;
}

const FAILSAFE_MS = 2000;

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const { playTransition } = useSound();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [destinationLabel, setDestinationLabel] = useState("");
  const pendingHrefRef = useRef<string | null>(null);
  const failsafeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFailsafe = useCallback(() => {
    if (failsafeTimerRef.current !== null) {
      clearTimeout(failsafeTimerRef.current);
      failsafeTimerRef.current = null;
    }
  }, []);

  const beginTransition = useCallback(
    (href: string, label: string) => {
      if (phase !== "idle") return;
      setDestinationLabel(label);
      pendingHrefRef.current = href;
      setPhase("covering");
      // Fires on transition START, not completion, per REBUILD-SPEC.md's
      // sound spec — transition.mp3 is a short (0.91s) cue meant to mark
      // the moment of intent, not the arrival.
      playTransition();

      failsafeTimerRef.current = setTimeout(() => {
        setPhase((current) => (current === "idle" ? current : "revealing"));
      }, FAILSAFE_MS);
    },
    [phase, playTransition]
  );

  const notifyCoverComplete = useCallback(() => {
    lenis?.stop();
    if (pendingHrefRef.current) {
      router.push(pendingHrefRef.current);
    }
    setPhase("covered");
  }, [lenis, router]);

  const notifyRevealComplete = useCallback(() => {
    clearFailsafe();
    lenis?.start();
    setPhase("idle");
    pendingHrefRef.current = null;
  }, [lenis, clearFailsafe]);

  useEffect(() => {
    if (phase !== "covered" || !pendingHrefRef.current) return;
    const targetPath = pendingHrefRef.current.split(/[?#]/)[0];
    if (pathname !== targetPath) return;

    clearFailsafe();
    lenis?.scrollTo(0, { immediate: true });
    setPhase("revealing");
  }, [pathname, phase, lenis, clearFailsafe]);

  useEffect(() => clearFailsafe, [clearFailsafe]);

  const value = useMemo<TransitionContextValue>(
    () => ({
      phase,
      destinationLabel,
      beginTransition,
      notifyCoverComplete,
      notifyRevealComplete,
    }),
    [phase, destinationLabel, beginTransition, notifyCoverComplete, notifyRevealComplete]
  );

  return (
    <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>
  );
}
