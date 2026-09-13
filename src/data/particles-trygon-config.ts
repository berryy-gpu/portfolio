import type { ISourceOptions } from "@tsparticles/engine";

/**
 * "Trygon" particle field — a second, independent tsParticles instance
 * mounted locally inside each Hero/CTA-type section (see the six call
 * sites), distinct from the site-wide ambient field in
 * particles-config.ts. Same translation approach as that file (verified
 * against the installed `@tsparticles/engine@4.4.0` types/source, not
 * assumed), with notes on what differs from a literal port:
 *
 * - `shape.type: "polygon"` + `polygon.nb_sides: 5` → `shape.options.polygon
 *   .sides: 5` (`@tsparticles/shape-polygon`, bundled in slim). `stroke`
 *   (width 0) is inert, same as the site-wide config's circle — dropped.
 *   `shape.image` (the GitHub-logo particle) is genuinely dead config —
 *   the active shape is "polygon", so that branch never ran in the
 *   original engine either — dropped, not fetched/bundled.
 * - `color.value: "#874130"` → `paint.color` (and `links.color`) use the
 *   real `--accent` token (`#a64f39`) instead of the literal supplied
 *   hex, for the same reason as the site-wide field: close enough in
 *   hue/family that it reads as on-brand rather than a second, slightly
 *   different rust tone competing with the first. Keep in sync with
 *   `--accent` in globals.css if that token ever changes.
 * - `opacity.random: true` with `anim.enable: false` → a single static
 *   random range per particle, `value: { min: 0.1, max: 0.5 }` (no
 *   `animation`), the same "random + no animation" collapse used for the
 *   site-wide config's `size`.
 * - `size.random: true` with `anim.enable: true` → the mirror image:
 *   `value: { min: 40, max: 99.96 }` PLUS a real `animation` block
 *   (`mode: "auto"` pings-pongs between the range endpoints indefinitely,
 *   `startValue: "random"` randomizes each particle's starting point,
 *   `destroy: "none"` keeps it alive at either extreme) — the same
 *   "random + animated" collapse used for the site-wide config's
 *   `opacity`. `ISizeAnimation` mirrors `IOpacityAnimation`'s shape
 *   exactly (both extend `IRangedAnimation` with a `destroy` field), so
 *   this is a direct structural parallel, not a guess.
 * - `line_linked` → `particles.links` (`@tsparticles/interaction-
 *   particles-links`, bundled in slim) — UNLIKE the site-wide config,
 *   this source has `line_linked.enable: true`, so (also unlike the
 *   site-wide field) this one DOES draw permanent particle-to-particle
 *   proximity lines at rest, not just on hover/grab.
 * - `move.attract` has no v4 equivalent (removed/relocated) and was
 *   `enable: false` anyway — dropped, nothing lost.
 * - `interactivity.events.resize` → top-level `resize: { enable }`.
 * - `retina_detect` → top-level `detectRetina`.
 * - `fullScreen: { enable: false }` is NOT from the source config, and is
 *   even more load-bearing here than for the site-wide field: this
 *   instance is meant to fill exactly the section it's mounted in (via
 *   its container's `position: absolute; inset: 0`), not the viewport —
 *   without this, tsParticles would inject its own fixed, full-viewport
 *   canvas and ignore the section-scoped container entirely.
 *
 * Two further deviations from a literal translation, deliberate and
 * flagged in the accompanying completion report (not silently changed):
 * `interactivity.detectsOn` is `"window"` here, not the source's
 * `"canvas"` — these canvases are `pointer-events: none` so real clicks/
 * hovers on the section's actual buttons and links pass through
 * untouched, which only works with window-based detection; and
 * `onClick.mode: "remove"` is preserved faithfully even though it
 * permanently deletes particles with no respawn.
 */
const TRYGON_ACCENT_COLOR = "#a64f39";

export const trygonParticlesConfig: ISourceOptions = {
  fullScreen: { enable: false },
  detectRetina: true,
  resize: { enable: true },
  particles: {
    number: {
      value: 9,
      density: { enable: false },
    },
    paint: {
      color: { value: TRYGON_ACCENT_COLOR },
    },
    shape: {
      type: "polygon",
      options: {
        polygon: { sides: 5 },
      },
    },
    opacity: {
      value: { min: 0.1, max: 0.5 },
    },
    size: {
      value: { min: 40, max: 99.96 },
      animation: {
        enable: true,
        speed: 10,
        sync: false,
        mode: "auto",
        startValue: "random",
        destroy: "none",
      },
    },
    links: {
      enable: true,
      distance: 200,
      color: TRYGON_ACCENT_COLOR,
      opacity: 1,
      width: 2,
    },
    move: {
      enable: true,
      speed: 8,
      direction: "none",
      random: true,
      straight: false,
      outModes: "out",
    },
  },
  interactivity: {
    detectsOn: "window",
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "remove" },
    },
    modes: {
      repulse: { distance: 200, duration: 0.4 },
      remove: { quantity: 2 },
    },
  },
};
