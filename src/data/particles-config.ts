import type { ISourceOptions } from "@tsparticles/engine";

/**
 * Site-wide ambient particle field — converted faithfully from a legacy
 * particles.js-style config the user supplied, into tsParticles v4's
 * option shape. Notes on the translation, verified against the installed
 * `@tsparticles/engine@4.4.0` types/source rather than assumed from memory
 * (the v1→v3+ option shape changed substantially):
 *
 * - `particles.color` doesn't exist anymore — `ParticlesOptions.doLoad()`
 *   only ever reads `data.paint`, so color now lives at
 *   `particles.paint.color`. `paint.fill.enable` already defaults to
 *   `true` in the engine's own `ParticlesOptions` constructor, so filled
 *   circles need no extra `fill` config beyond the color itself.
 * - `opacity.random: true` + `opacity.anim.opacity_min: 0` collapse into a
 *   single `value: { min: 0, max: 1 }` range (v4 expresses "randomized
 *   between a floor and a ceiling" as one range rather than a separate
 *   boolean + min field). `animation.mode: "auto"` reproduces the classic
 *   particles.js opacity behavior of fading up and down indefinitely
 *   rather than one-shot; `destroy: "none"` keeps particles alive at
 *   opacity 0 instead of removing them.
 * - `size.random: true` with `anim.enable: false` (as in the source
 *   config) similarly becomes `value: { min: 0.3, max: 3 }` — a static
 *   per-particle random size, no animation. `size_min: 0.3` was inert in
 *   the original engine in this exact combination (a legacy quirk: the
 *   random-size formula there ignored `size_min` unless `anim.enable` was
 *   also true), but reusing it as the floor here matches the value's
 *   obvious intent rather than replicating that dead-code accident.
 * - `line_linked` (a separate feature — particle-to-particle proximity
 *   lines, `@tsparticles/interaction-particles-links`) is left unset
 *   entirely, matching its `enable: false` in the source. This is
 *   distinct from `interactivity.modes.grab.links`, which only draws
 *   lines from the CURSOR to nearby particles while actively grabbing —
 *   that one IS configured below, so hovering still shows lines even
 *   though there are none at rest.
 * - `interactivity.detect_on: "window"` → `detectsOn: "window"` — this is
 *   exactly why the canvas can stay `pointer-events: none` and still
 *   respond to hover/click: interactivity listens on the window, not the
 *   canvas itself.
 * - `interactivity.events.resize` moved out of `interactivity` entirely —
 *   it's a top-level `resize: { enable }` option in v4.
 * - Dropped as genuinely dead config, not translated: `shape.image` (the
 *   GitHub-logo particle — `shape.type` is "circle", so this branch never
 *   ran) and the `bubble` interaction mode (defined in the source's
 *   `modes` but never wired to an `onhover`/`onclick` event, so it never
 *   fired either).
 * - `move.attract` has no equivalent in v4's `IMove` at all (the feature
 *   was removed/relocated), and was `enable: false` in the source anyway
 *   — dropped, nothing lost.
 * - `fullScreen: { enable: false }` is NOT from the source config — it's
 *   necessary here specifically because tsParticles' fullScreen mode
 *   defaults to `true` and injects its OWN fixed, full-viewport canvas
 *   with its own z-index, bypassing whatever container/positioning the
 *   caller sets up. This site positions the canvas itself (fixed, the
 *   shared `zIndex.particles` token, pointer-events:none — see
 *   particle-field.tsx), so tsParticles must render into that container
 *   rather than taking over positioning itself.
 *
 * Color: the source's `#874130` (a rust/terracotta brown) sits close to
 * this site's actual `--accent` token (`#a64f39` in globals.css, used for
 * the hero's "grow" highlight and the pulsing availability dot) — close
 * enough in hue/family that using the real brand color reads as
 * intentional rather than off-palette, so that's what's hardcoded below
 * instead of the literal supplied value. It's a plain literal rather than
 * a runtime read of the CSS custom property because tsParticles resolves
 * colors through its own HSL pipeline, not the browser's CSS engine — a
 * raw `var(--accent)` string doesn't parse there. Keep this in sync with
 * `--accent` in globals.css if that token ever changes.
 */
const PARTICLE_ACCENT_COLOR = "#a64f39";

export const particlesConfig: ISourceOptions = {
  fullScreen: { enable: false },
  detectRetina: true,
  resize: { enable: true },
  particles: {
    number: {
      value: 77,
      density: { enable: true, width: 800, height: 800 },
    },
    paint: {
      color: { value: PARTICLE_ACCENT_COLOR },
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: { min: 0, max: 1 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
        mode: "auto",
        startValue: "random",
        destroy: "none",
      },
    },
    size: {
      value: { min: 0.3, max: 3 },
      animation: {
        enable: false,
      },
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      outModes: "out",
    },
  },
  interactivity: {
    detectsOn: "window",
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: true, mode: "repulse" },
    },
    modes: {
      grab: { distance: 400, links: { opacity: 1 } },
      repulse: { distance: 400, duration: 0.4 },
      push: { quantity: 4 },
      remove: { quantity: 2 },
    },
  },
};
