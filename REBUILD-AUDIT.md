# Rebuild Audit

Compiled at the end of Phase 11, after all 11 phases of REBUILD-SPEC.md were implemented in one continuous session (Phases 1–4 in earlier sessions, Phases 5–11 in this one). This documents what was verified, how, and — honestly — what this session's tooling could **not** verify and still needs a human pass.

## Tooling available vs. not

This audit was produced by a coding agent with a terminal (Node/npm, TypeScript, ESLint, `next build`) but **no browser automation** — no Lighthouse, no real device/viewport rendering, no screen reader. Every claim below is labeled by how it was actually checked. Anything marked **[NEEDS HUMAN/BROWSER PASS]** is a real gap in this audit, not a pass I'm claiming without evidence.

## 1. Build & bundle sizes — verified via `npm run build`

Final production build, all routes:

| Route | First Load JS | Under 250KB? |
|---|---|---|
| `/` | 193 KB | ✓ |
| `/about` | 181 KB | ✓ |
| `/contact` | 183 KB | ✓ |
| `/services` | 212 KB | ✓ |
| `/work` | 227 KB | ✓ |
| `/work/[clientId]` | 181 KB | ✓ |
| all `opengraph-image`/`sitemap`/`robots` routes | 103 KB | ✓ |

Every route is under the 250KB budget, with headroom. `@react-three/*` (Hero scene, CTA scene, the persistent canvas) is dynamically imported with `ssr:false` everywhere it's used (`hero-view.tsx`, `cta-view.tsx`, `webgl-provider.tsx`) — confirmed by the fact that `/` sits at 193KB despite mounting a WebGL hero; the three.js/postprocessing/maath stack (~150KB+) loads as a separate chunk, not in the route's initial JS. **One real regression was caught and fixed mid-session**: an early version of Hero statically imported the WebGL scene, which spiked `/` to 521KB First Load JS; moving it behind `next/dynamic` brought it back down (documented in this session's own transcript).

## 2. Static generation — verified via `npm run build` output

All 7 `/work/[clientId]` routes confirmed statically generated (`●` SSG marker) on every build this phase: `cybernetix`, `pixelscape`, `aureate`, `clix`, `hihat`, `eternal`, `friends-perk-cafe`. Their `opengraph-image` routes generate for all 7 as well.

## 3. TypeScript & lint — verified

`npx tsc --noEmit` and `npm run lint` both clean at the end of every phase in this session, including this final one. No `any` types introduced except where a third-party type genuinely required a cast (documented inline where it happens, e.g. `hero.tsx`'s `View` `track` prop).

## 4. Frozen files — verified via `git diff --stat`

`featured-work.tsx`, `animated-website-preview.tsx`, `cursor-spotlight.tsx`, `globals.css`'s `:root`/`@theme inline` blocks, and the entire contact pipeline (`api/contact/route.ts`, `lib/resend.ts`, `lib/validations/contact.ts`) show **zero diff** — checked after every single phase, not just at the end. The one `globals.css` change this session (a `@keyframes eq` block for the sound toggle) was confirmed via `git diff` to be purely additive, appended after the frozen blocks, touching no existing rule or token.

## 5. Reduced-motion pass — verified via code review, not browser testing

Grepped every file using `gsap.to/from/fromTo/timeline`, `useFrame`, or `requestAnimationFrame` and checked each for reduced-motion handling. Ten files initially flagged as "no direct check" — all ten turned out to be correctly covered, mostly systemically:

- `useScrollReveal`/`useScrollScrub` (the two shared hooks nearly every scroll animation in the rebuild goes through) check `prefers-reduced-motion` internally via `gsap.matchMedia()` — any component built on them (Statement, Process, AboutStatement, AboutTimeline, and others) inherits this for free.
- **The quality-tier system forces `tier: 'low'` whenever `prefers-reduced-motion: reduce` matches** (`quality-provider.tsx`), and `tier === 'low'` is what gates out the WebGL hero, the CTA scene (`tier === 'high'` only), the custom cursor, and marquee velocity-coupling. So Hero's and the CTA's `useFrame` loops never even mount for reduced-motion users — not because they check it themselves, but because the tier system already turned off everything upstream of them.
- `CursorFollowPreview` has no internal check by design (documented in its own file) — callers (`Capabilities`, `ClientStories`) are responsible for only mounting it when `!prefersReducedMotion`, and both do.

**One minor, non-blocking finding**: `use-lenis-velocity.ts` keeps its own rAF loop running even when the only consumer (`Marquee`) is in its static (non-animating) branch under reduced motion — harmless (it just updates a ref nobody reads) but a small amount of wasted work. Not fixed in this pass; noted for a future cleanup.

## 6. Low quality-tier pass — verified via code review

Confirmed every WebGL/heavy-motion surface checks `useQualityTier()` and degrades correctly at `'low'`:
- Hero: `showWebgl = tier !== "low"` → renders `/images/posters/hero.jpg` + a CSS-grain overlay instead of the Canvas.
- CTA scene: `tier === "high"` only (medium/low get type + button + email, no 3D).
- `WebGLProvider`: doesn't mount `PersistentCanvas` at all below `'low'`.
- Custom cursor: `enabled` requires `tier !== 'low'`.
- Marquee (client logos, About tools): `isStatic = prefersReducedMotion || tier === 'low'` — no animation, no velocity coupling.
- Motion Reel: `useNativeScroll = isCoarsePointer || tier === 'low' || prefersReducedMotion` → falls back to plain `overflow-x-auto snap-x`, no GSAP pin.

## 7. Keyboard pass — verified via code review, not manual tab-through

Every `onClick` handler in components written/touched this session resolves to a real `<button>` or `<a>`/`<Link>`/`<TransitionLink>` element (grepped for `onClick` outside those and found none — confirmed each hit individually). Two real focus traps exist and were built to the same pattern: `navigation.tsx`'s mobile overlay (pre-existing, untouched) and the new `motion-reel-lightbox.tsx` (Tab cycles within, Escape closes and restores focus to the trigger). **[NEEDS HUMAN/BROWSER PASS]**: I could not actually tab through every page in a browser to confirm focus order/visibility feels right, or that the pinned sections (Statement, Motion Reel, Process, the client Next-Project block) don't trap scroll/focus in some way I didn't anticipate.

## 8. Viewport / horizontal-overflow pass — partially verified, mostly **[NEEDS HUMAN/BROWSER PASS]**

Could not render at 375/768/1024/1440/2560 without a browser. Checked structurally instead:
- Motion Reel's `420px`-wide clips sit inside a section with `overflow-hidden`, so the intentionally-wider-than-viewport track can't leak into page-level horizontal scroll.
- `CursorFollowPreview`'s fixed-width (340px) floating image is `position: fixed`, so it can't contribute to document width regardless of viewport size — and it's gated to hover-capable pointers only, so it never mounts on the narrow touch viewports where fixed-width fixed-position elements are riskiest.
- Footer's bleeding name (`text-display-xxl`, `whitespace-nowrap`) sits in a block-level `overflow-hidden` wrapper, which should clip without expanding page width — but **this one is worth an actual look at 375px**, since a long name at 160px font-size in a narrow viewport is the kind of thing that reads fine in code and looks wrong on a real screen.

## 9. Lighthouse — **[NEEDS HUMAN/BROWSER PASS, NOT DONE]**

No Lighthouse run was possible from this session (no browser). The spec's target (mobile Perf 85+, A11y 95+ on `/`, `/work`, `/work/cybernetix`, `/about`, `/contact`) is unverified. Everything in sections 1–8 above is the best available proxy from a terminal-only environment; it is not a substitute for an actual Lighthouse run.

## 10. Sound system — verified via code review + build

`SoundProvider` (default off, one shared `AudioContext`, ambient gain 0.08 / UI gain 0.15, ambient loop scheduled with a 2s overlap relying on the files' own baked-in fades, suspended on `visibilitychange`, fully silent under `prefers-reduced-motion` regardless of the stored preference) and `SoundToggle` (bottom-right, 4-bar equalizer, `localStorage`-backed) are both built and wired into the app root. `transition.mp3` fires on transition **start** (`beginTransition`, before the cover animation plays), not completion, per spec. **Scope note, stated plainly**: `playHover`/`playClick` are real, working, exposed functions, but this session did not retrofit them onto every interactive element site-wide — that would have meant touching dozens of files for a comparatively low-value pass given the time available. They're ready for a future targeted pass.

## Known content/scope gaps carried forward (not new to this phase, restated for completeness)

- `testimonials.ts` has no real entries — the Testimonials section (and every `getTestimonialByClientId` call on client-story pages) correctly renders nothing rather than inventing a quote.
- `case-studies.ts` (Phase 3) is an explicitly-labeled first-pass draft derived only from real facts already in the data layer — still needs your edit pass before it reads as finished copy.
- Reel/showreel videos have no poster images (ffmpeg wasn't available in Phase 1) — `<video preload="none">` with no `poster` attribute; a real gap, not a design choice.
- A new, unwired client (`ayarchitects` — 4 project screenshots appeared in `public/images/projects/` partway through this session) still has no entry anywhere in `src/data`. Not touched, per earlier flag to you.

## Bottom line

Everything a terminal can check — types, lint, build, bundle budget, SSG output, frozen-file integrity, and a structural (not visual) accessibility/motion/quality-tier review — is clean. Sections 7, 8, and 9 above are the honest boundary of what this session could verify; treat them as the actual next step, not as done.
