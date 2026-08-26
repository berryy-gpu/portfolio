import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
