"use client";

/**
 * Bottom-right sound toggle, 4 equaliser bars — bounce (staggered) when
 * sound is on, sit flat when off. Preference itself lives in
 * SoundProvider (localStorage); this is purely the control.
 */

import { useSound } from "@/components/providers/sound-provider";
import { zIndex } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

export function SoundToggle() {
  const { enabled, toggle, playClick } = useSound();

  const handleClick = () => {
    // Fires before toggle()'s state update lands, so this only actually
    // plays when muting (turning sound off from an already-enabled
    // state) — silent no-op the first time sound turns on, since
    // `enabled` here still reflects the pre-click render. Acceptable:
    // the ambient loop's own 1.5s fade-in is the audible confirmation
    // in that case instead.
    playClick();
    toggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute sound" : "Unmute sound"}
      style={{ zIndex: zIndex.elevated }}
      className="fixed right-6 bottom-6 flex h-10 w-10 items-center justify-center gap-0.5 rounded-full border border-border bg-surface/80 backdrop-blur-functional transition-colors hover:border-accent"
    >
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            "w-0.5 rounded-full bg-text-secondary",
            enabled ? "animate-[eq_1s_ease-in-out_infinite]" : "h-1.5"
          )}
          style={enabled ? { animationDelay: `${index * 0.15}s` } : undefined}
        />
      ))}
    </button>
  );
}
