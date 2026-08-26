"use client";

/**
 * Site-wide sound system (REBUILD-SPEC.md): DEFAULT OFF, one shared
 * AudioContext, one gain stage per category (ambient 0.08, UI 0.15 — the
 * files are already loudness-matched, so no per-file correction), a
 * looped ambient bed with a scheduled 2s-overlap crossfade (relying on
 * each loop's own baked-in 2s fade in/out, not a manual gain ramp),
 * suspended on visibilitychange, and fully silent under
 * prefers-reduced-motion regardless of the stored preference.
 *
 * `playHover`/`playClick`/`playTransition` are exposed as ready-to-use
 * one-shot triggers; only `playTransition` is actually wired up in this
 * phase (transition-provider.tsx calls it on transition START, per
 * spec — "fire on transition START, not completion"). Hover/click SFX
 * are real, working infrastructure but not retrofitted onto every
 * interactive element site-wide in this pass.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

const STORAGE_KEY = "portfolio:sound-enabled";
const AMBIENT_GAIN = 0.08;
const UI_GAIN = 0.15;
const AMBIENT_FALLBACK_DURATION_S = 96;
const AMBIENT_CROSSFADE_S = 2;

type SoundName = "ambient" | "hover" | "click" | "transition";

interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  playHover: () => void;
  playClick: () => void;
  playTransition: () => void;
}

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  toggle: () => {},
  playHover: () => {},
  playClick: () => {},
  playTransition: () => {},
});

export function useSound() {
  return useContext(SoundContext);
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Partial<Record<SoundName, AudioBuffer>>>({});
  const ambientSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const ambientTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      setEnabled(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // sessionStorage/localStorage unavailable — stays off.
    }
  }, []);

  const ensureContext = (): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    return audioCtxRef.current;
  };

  const loadBuffer = async (ctx: AudioContext, name: SoundName): Promise<AudioBuffer> => {
    const cached = buffersRef.current[name];
    if (cached) return cached;
    const response = await fetch(`/audio/${name}.mp3`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    buffersRef.current[name] = audioBuffer;
    return audioBuffer;
  };

  const stopAmbient = () => {
    ambientSourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch {
        // already stopped
      }
    });
    ambientSourcesRef.current = [];
    if (ambientTimerRef.current !== null) {
      clearTimeout(ambientTimerRef.current);
      ambientTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!enabled || prefersReducedMotion) {
      stopAmbient();
      return;
    }

    const ctx = ensureContext();
    if (!ctx) return;
    let cancelled = false;

    (async () => {
      const buffer = await loadBuffer(ctx, "ambient");
      if (cancelled) return;

      const gainNode = ctx.createGain();
      gainNode.gain.value = AMBIENT_GAIN;
      gainNode.connect(ctx.destination);

      const duration = buffer.duration || AMBIENT_FALLBACK_DURATION_S;
      let nextStart = ctx.currentTime;

      const playOne = (startAt: number) => {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode);
        source.start(startAt);
        ambientSourcesRef.current.push(source);
      };

      const scheduleNext = () => {
        nextStart += duration - AMBIENT_CROSSFADE_S;
        const delayMs = Math.max(0, (nextStart - ctx.currentTime - 1) * 1000);
        ambientTimerRef.current = setTimeout(() => {
          playOne(nextStart);
          scheduleNext();
        }, delayMs);
      };

      playOne(nextStart);
      scheduleNext();
    })();

    return () => {
      cancelled = true;
      stopAmbient();
    };
  }, [enabled, prefersReducedMotion]);

  useEffect(() => {
    const handleVisibility = () => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (document.hidden) {
        ctx.suspend().catch(() => {});
      } else if (enabled) {
        ctx.resume().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [enabled]);

  const playOneShot = async (name: Exclude<SoundName, "ambient">) => {
    if (!enabled || prefersReducedMotion) return;
    const ctx = ensureContext();
    if (!ctx) return;
    if (ctx.state === "suspended") await ctx.resume().catch(() => {});

    const buffer = await loadBuffer(ctx, name);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gainNode = ctx.createGain();
    gainNode.gain.value = UI_GAIN;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();
  };

  const toggle = () => {
    setEnabled((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      if (next) ensureContext()?.resume().catch(() => {});
      return next;
    });
  };

  const value = useMemo<SoundContextValue>(
    () => ({
      enabled,
      toggle,
      playHover: () => {
        void playOneShot("hover");
      },
      playClick: () => {
        void playOneShot("click");
      },
      playTransition: () => {
        void playOneShot("transition");
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, prefersReducedMotion]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
