import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * Plain `twMerge` doesn't know this project's custom `--text-*` type-scale
 * tokens (globals.css) aren't Tailwind's own default `text-{xs,sm,base,...}`
 * scale, so it can't classify `text-small`/`text-body`/`text-body-lg`/
 * `text-caption`/`text-h1..h4`/`text-display*` as font-size utilities.
 * Confirmed live: without this, `cn("text-body-lg text-text-secondary")`
 * silently drops `text-body-lg` — twMerge falls back to bucketing it with
 * `text-color` utilities (both are unprefixed `text-{word}` patterns) and
 * the later `text-text-secondary` in the same conflict group wins,
 * discarding the font size entirely. This combination (a custom size token
 * immediately followed by a text-color token, merged through `cn()`) is
 * common site-wide, so this is a real, previously-silent bug, not a
 * hypothetical one. Teaching twMerge these are font-size values fixes it
 * while leaving genuine conflicts (two sizes, or two colors) still
 * correctly deduplicated.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "small",
            "body",
            "body-lg",
            "caption",
            "display",
            "display-xl",
            "display-xxl",
            "h1",
            "h2",
            "h3",
            "h4",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Frame-rate-independent exponential damping — the shared "trailing cursor"
 * math behind every damped-follow effect on the site (Magnetic, the custom
 * cursor, the hero shader's pointer ripple). `smoothing` is a rate constant
 * (higher = snappier); `deltaSeconds` is the elapsed time since the last
 * sample so the same smoothing value reads consistently regardless of frame
 * rate.
 */
export function damp(
  current: number,
  target: number,
  smoothing: number,
  deltaSeconds: number
): number {
  return current + (target - current) * (1 - Math.exp(-smoothing * deltaSeconds))
}
