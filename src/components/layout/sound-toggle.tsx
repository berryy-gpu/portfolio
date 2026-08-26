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
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
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
