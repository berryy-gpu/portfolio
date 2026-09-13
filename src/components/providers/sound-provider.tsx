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
 * `playHover`/`playClick`/`playTransition` are ready-to-use one-shot
 * triggers, wired onto TransitionLink (click, opt-in hover), the sound
 * toggle, primary CTAs, and work/gallery cards site-wide.
 *
 * Diagnosed the "sound stops on page change" report with a real CDP-driven
 * browser walkthrough (headless Chrome, both `next dev` and a production
 * build) clicking through Nav -> /work -> /about -> /services -> /contact
 * -> / via the real TransitionLink soft-navigation path: AudioContext.state
 * stayed "running" and the ambient effect never re-ran across every
 * client-side route change — SoundProvider genuinely does not remount, and
 * the audio pipeline is not interrupted by soft navigation. The one
 * reproducible gap is a HARD page load (typing a URL, a refresh, a
 * bookmark, an externally-opened link) — a fresh mount of SoundProvider
 * always starts with `hasInteracted: false`, so ambient waits on a brand
 * new gesture even if the visitor already engaged with the site moments
 * earlier in the same tab. `hasInteracted` (unlike `muted`) is now also
 * mirrored into sessionStorage so a hard reload within the same tab
 * session re-arms immediately on mount instead of waiting for a second
 * gesture — this doesn't fight the "silent on a genuinely fresh visit"
 * design (a new tab/session has no sessionStorage entry), and the resume
 * attempt it triggers fails silently if the browser's autoplay policy
 * still blocks it, falling back to the existing first-interaction listener.
 *
 * Re-verified for the go-live pass with a scripted Playwright walkthrough
 * (real Chromium, instrumented AudioContext instances, not just state
 * inspection) covering cases the earlier diagnosis didn't: 6 sequential
 * TransitionLink navigations plus rapid back-to-back clicks (150ms apart,
 * shorter than the transition's own ~1.2s cycle) never created a second
 * AudioContext or dropped `state` from "running". Also let a real session
 * run past the ambient loop's own ~96s crossfade boundary while navigating
 * — `scheduleNext`'s setTimeout fired and rescheduled correctly even with
 * a route change landing right on top of it. The hard-reload gap above is
 * real and unavoidable (confirmed against Chromium's actual default
 * autoplay policy, not a permissive test flag: a fresh document's
 * AudioContext starts "suspended" and `currentTime` stays frozen at 0
 * until the next real gesture, exactly as browsers require) — the
 * sessionStorage re-arm plus fallback listener already handle it as well
 * as a page can.
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

const STORAGE_KEY = "portfolio:sound-muted";
const SESSION_INTERACTED_KEY = "portfolio:sound-interacted-session";
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
  const prefersReducedMotion = useReducedMotion();
  // `muted` is the persisted, explicit opt-out — starts false (the
  // hydration-safe default) since nothing plays until a real gesture
  // fires regardless of this value; corrected from localStorage on mount.
  const [muted, setMuted] = useState(false);
  // Becomes true once on the first qualifying gesture (or a toggle
  // click, which is itself a gesture) — never resets for the rest of a
  // client-side-navigated session (soft nav never remounts this
  // provider). Seeded from sessionStorage on mount so a HARD reload
  // within the same tab re-arms immediately instead of waiting on a
  // second gesture — see the docstring above.
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
      if (window.sessionStorage.getItem(SESSION_INTERACTED_KEY) === "1") {
        setHasInteracted(true);
      }
    } catch {
      // storage unavailable — stays unmuted/un-interacted (still gated
      // on a real first interaction below, so nothing plays regardless).
    }
  }, []);

  // The one-time first-interaction listener — armed whenever there's
  // still something it needs to do (not muted, motion allowed).
  // Deliberately NOT gated on `hasInteracted` alone: on a hard reload
  // seeded from sessionStorage, `hasInteracted` starts true but the
  // AudioContext still starts "suspended" (a fresh document has no live
  // user-gesture activation yet, so the ambient effect's own resume()
  // attempt silently fails) — this listener is what actually resumes it
  // on the visitor's next real gesture, on top of its original job of
  // setting `hasInteracted` for a genuinely fresh visit. Removes itself
  // after firing once, per spec.
  useEffect(() => {
    if (muted || prefersReducedMotion) return;

    const handleFirstInteraction = () => {
      setHasInteracted(true);
      const ctx = audioCtxRef.current;
      if (ctx?.state === "suspended") void ctx.resume().catch(() => {});
    };

    FIRST_INTERACTION_EVENTS.forEach((eventName) =>
      window.addEventListener(eventName, handleFirstInteraction, { once: true, passive: true })
    );

    return () => {
      FIRST_INTERACTION_EVENTS.forEach((eventName) =>
        window.removeEventListener(eventName, handleFirstInteraction)
      );
    };
  }, [muted, prefersReducedMotion]);

  useEffect(() => {
    if (!hasInteracted) return;
    try {
      window.sessionStorage.setItem(SESSION_INTERACTED_KEY, "1");
    } catch {
      // sessionStorage unavailable — a hard reload just waits on a fresh
      // gesture again, same as before this fix.
    }
  }, [hasInteracted]);

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
