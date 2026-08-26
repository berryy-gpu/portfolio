import { zIndex } from "@/lib/motion-tokens";

/**
 * The 'low' tier / prefers-reduced-motion stand-in for BackdropScene — a
 * static radial-gradient built only from existing tokens via
 * `color-mix()`, no new hex values, no canvas at all. Same negative
 * zIndex.canvas token the real canvas uses, for the same reason.
 */
export function BackdropFallback() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: zIndex.canvas,
        background:
          "radial-gradient(ellipse 70% 60% at 50% 35%, color-mix(in srgb, var(--accent) 18%, var(--background)) 0%, var(--background) 70%)",
      }}
    />
  );
}
