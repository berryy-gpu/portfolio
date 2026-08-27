"use client";

/**
 * Site-wide sound system (REBUILD-SPEC.md step 7 — supersedes this
 * file's earlier "default off, toggle-only" design): audible as early as
 * browsers permit. Page loads silent (audio armed, not playing); a
 * ONE-TIME listener on the first pointerdown/keydown/wheel anywhere
 * starts the ambient loop with a 1.5s fade-in, then removes itself. A
 * visitor who previously muted explicitly (via the toggle) never
 * auto-starts on later visits — that preference is the only thing
 * persisted in localStorage. One shared AudioContext, one gain stage per
 * category (ambient 0.08, UI 0.15 — the files are already
 * loudness-matched, so no per-file correction), a looped ambient bed with
 * a scheduled 2s-overlap crossfade (relying on each loop's own baked-in
 * 2s fade in/out, not a manual gain ramp), suspended on visibilitychange,
 * and fully silent under prefers-reduced-motion regardless of the stored
 * preference (no listener is even armed in that case).
 *
 * `playHover`/`playClick`/`playTransition` are exposed as ready-to-use
 * one-shot triggers; only `playTransition` is actually wired up (
 * transition-provider.tsx calls it on transition START, per spec —
 * "fire on transition START, not completion"). Hover/click SFX are real,
 * working infrastructure but not retrofitted onto every interactive
 * element site-wide in this pass.
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
import { usePathname } from "next/navigation";

const STORAGE_KEY = "portfolio:sound-muted";
const AMBIENT_GAIN = 0.08;
const UI_GAIN = 0.15;
const AMBIENT_FALLBACK_DURATION_S = 96;
const AMBIENT_CROSSFADE_S = 2;
const AMBIENT_FADE_IN_S = 1.5;
const FIRST_INTERACTION_EVENTS = ["pointerdown", "keydown", "wheel"] as const;

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
  // TEMPORARY — step 6 diagnosis, remove after.
  console.log("SoundProvider mount");
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  // `muted` is the persisted, explicit opt-out — starts false (the
  // hydration-safe default) since nothing plays until a real gesture
  // fires regardless of this value; corrected from localStorage on mount.
  const [muted, setMuted] = useState(false);
  // Becomes true once on the first qualifying gesture (or a toggle
  // click, which is itself a gesture) — never resets for the session.
  const [hasInteracted, setHasInteracted] = useState(false);
  const enabled = hasInteracted && !muted;
  const audioCtxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Partial<Record<SoundName, AudioBuffer>>>({});
  const ambientSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const ambientTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstAmbientPlayRef = useRef(true);

  useEffect(() => {
    try {
      setMuted(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // localStorage unavailable — stays unmuted (still gated on a
      // real first interaction below, so nothing plays regardless).
    }
  }, []);

  useEffect(() => {
    // TEMPORARY — step 6 diagnosis, remove after.
    console.log("route change", { pathname, ctxState: audioCtxRef.current?.state });
  }, [pathname]);

  // The one-time first-interaction listener — armed only when there's
  // something to arm for (not already interacted, not muted, motion
  // allowed). Removes itself after firing once, per spec.
  useEffect(() => {
    if (hasInteracted || muted || prefersReducedMotion) return;

    const handleFirstInteraction = () => setHasInteracted(true);

    FIRST_INTERACTION_EVENTS.forEach((eventName) =>
      window.addEventListener(eventName, handleFirstInteraction, { once: true, passive: true })
    );

    return () => {
      FIRST_INTERACTION_EVENTS.forEach((eventName) =>
        window.removeEventListener(eventName, handleFirstInteraction)
      );
    };
  }, [hasInteracted, muted, prefersReducedMotion]);

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
    // TEMPORARY — step 6 diagnosis, remove after.
    console.log("ambient effect start", { enabled, prefersReducedMotion });

    if (!enabled || prefersReducedMotion) {
      stopAmbient();
      return;
    }

    const ctx = ensureContext();
    if (!ctx) return;
    console.log("ambient effect: ctx.state before resume", ctx.state);
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    let cancelled = false;

    (async () => {
      const buffer = await loadBuffer(ctx, "ambient");
      if (cancelled) return;

      const gainNode = ctx.createGain();
      if (isFirstAmbientPlayRef.current) {
        isFirstAmbientPlayRef.current = false;
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(AMBIENT_GAIN, ctx.currentTime + AMBIENT_FADE_IN_S);
      } else {
        gainNode.gain.value = AMBIENT_GAIN;
      }
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
      // TEMPORARY — step 6 diagnosis, remove after.
      console.log("ambient effect cleanup", { enabled, prefersReducedMotion });
      cancelled = true;
      stopAmbient();
    };
  }, [enabled, prefersReducedMotion]);

  useEffect(() => {
    const handleVisibility = () => {
      const ctx = audioCtxRef.current;
      // TEMPORARY — step 6 diagnosis, remove after.
      console.log("visibilitychange", { hidden: document.hidden, ctxState: ctx?.state });
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
    // A toggle click is itself a real gesture — counts as the first
    // interaction if one hasn't happened yet, so unmuting always starts
    // playback immediately rather than waiting on a separate gesture.
    setHasInteracted(true);
    setMuted((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      if (!next) ensureContext()?.resume().catch(() => {});
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
