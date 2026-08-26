# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is a full portfolio site — homepage, `/work`, `/work/[clientId]` (7 static
case-study routes), `/services`, `/about`, `/contact` are all built and live on
Vercel, backed by a real data layer under `src/data/`. It is currently
**mid-rebuild of the presentation layer only** (the data layer, token system,
and section registry are staying as-is).

**Read `REBUILD-SPEC.md` in the repo root before starting any rebuild work.**
It is the full design/architecture brief and the authoritative source for the
target look, motion vocabulary, quality-tier behavior, and the 11-phase build
order. This file (CLAUDE.md) covers repo mechanics; REBUILD-SPEC.md covers
design intent — don't duplicate one into the other.

While the rebuild is in progress, treat these as load-bearing constraints
(see REBUILD-SPEC.md's "STANDING RULES" for the full list the active session
is working under):
- `src/components/sections/featured-work.tsx`, `src/components/ui/animated-website-preview.tsx`,
  and `src/components/work/cursor-spotlight.tsx` are FROZEN — byte-identical,
  do not restyle or refactor them.
- Color tokens in `src/app/globals.css` (`:root` / `@theme inline`) are FROZEN.
- `src/app/api/contact/route.ts`, `src/lib/resend.ts`, `src/lib/validations/contact.ts`
  are FROZEN — presentation around the contact form may change, the pipeline
  itself may not.
- `src/data/*` is the correct, load-bearing source of content. Never invent
  testimonials/clients/metrics/copy — an empty data array means the section
  renders `null`.

## Commands

```bash
npm run dev      # start dev server (Turbopack) at localhost:3000
npm run build    # production build (also runs typecheck)
npm run start    # serve the production build
npm run lint     # ESLint (flat config, eslint.config.mjs)
npx tsc --noEmit # typecheck only, no build
```

There is no test runner configured yet.

To add a shadcn/ui component: `npx shadcn@latest add <component>` — writes into `src/components/ui/`.

## Stack

- **Next.js 15** (App Router) on **React 19**, TypeScript, `src/` layout, `@/*` import alias → `src/*`.
- **Tailwind CSS v4** — no `tailwind.config.*` file; theme tokens (colors, type scale, spacing, radii, shadows) live as CSS custom properties in `src/app/globals.css` under `@theme inline` and `:root`. Single fixed dark theme, no light mode/toggle.
- **shadcn/ui**, configured via `components.json` with the `base-nova` style, `neutral` base color, and **`@base-ui/react`** as the primitive layer (not Radix — this is shadcn's current default, so don't assume Radix primitives/APIs when reading or extending `src/components/ui/*`).
- **GSAP + ScrollTrigger**, **Lenis** (smooth scroll), **Framer Motion**, **React Three Fiber** (`@react-three/fiber`, `@react-three/drei`, `three`), **Lucide React** for icons, **class-variance-authority** / **clsx** / **tailwind-merge** for variant/class composition, **react-hook-form** + **zod** for the contact form, **Resend** for email delivery.

## Architecture

- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge). Use this for all conditional/merged className composition.
- `src/lib/gsap.ts` — the only place `ScrollTrigger` is registered (guarded by `typeof window !== "undefined"`). Always import `gsap`/`ScrollTrigger` from here, not directly from `"gsap"`, so registration stays centralized.
- `src/lib/motion-tokens.ts` — shared `duration`/`easing` (Framer) and `gsapEasing` (GSAP-native) constants, plus `zIndex` tiers. Reuse these instead of inlining new timing values.
- `src/hooks/use-isomorphic-layout-effect.ts` — `useLayoutEffect` on the client / `useEffect` on the server. Use this instead of `useLayoutEffect` directly in any component that runs GSAP setup, to avoid SSR warnings.
- `src/hooks/use-media-query.ts` — SSR-safe media query hook (returns a stable default until mount, then the real match). This is the pattern any new "detect once on mount" hook (e.g. a quality-tier provider) should follow to avoid hydration mismatches.
- `src/hooks/use-scroll-reveal.ts` — shared GSAP `ScrollTrigger.batch()` entrance reveal for homepage sections, with `prefers-reduced-motion` handled via `gsap.matchMedia()`. Extend this for new scroll-driven reveals rather than reimplementing the reduced-motion/cleanup logic.
- `src/components/providers/` — the app's provider composition root.
  - `providers.tsx` exports `<Providers>`, mounted once in `src/app/layout.tsx` around `children`. Add any new app-wide context/provider (quality tier, cursor, sound, WebGL, transitions, etc.) here rather than editing `layout.tsx` directly.
  - `smooth-scroller.tsx` wires **Lenis** into the **GSAP ticker** (`gsap.ticker.add`, `lagSmoothing(0)`) and forwards Lenis scroll events to `ScrollTrigger.update`. This is the integration point that makes Lenis smooth-scroll and GSAP ScrollTrigger agree on scroll position. Exposes `useLenis()` for components that need the instance directly (e.g. `lenis.stop()`/`scrollTo()` during transitions).
- `src/components/ui/` — shadcn-generated primitives (`button.tsx`, `badge.tsx`) plus hand-built shared presentational primitives (`container.tsx`, `section.tsx`, `section-header.tsx`, `form-field.tsx`, `video-player.tsx`, `animated-website-preview.tsx` — the last is FROZEN, see above). Don't hand-edit the shadcn-generated variant files beyond what `shadcn add`/config would produce; treat those specifically as regenerable.
- `src/components/sections/` — homepage section components (`hero.tsx`, `featured-work.tsx` [FROZEN], `services-overview.tsx`, `craft-in-motion.tsx`, `what-i-can-help-you-build.tsx`, `from-idea-to-impact.tsx`, `client-trust-strip.tsx`, `homepage-cta.tsx`), composed together in `homepage-sections.tsx`.
- `src/components/three/hero-scene.tsx` — the current (pre-rebuild) sole Three.js moment: a low-poly icosahedron, dynamically imported with `ssr: false` from `hero.tsx`. REBUILD-SPEC.md replaces this with a persistent single-`<Canvas>` architecture (`View.Port`/`View` slots) — don't add a second ad-hoc `<Canvas>` elsewhere without reading that spec first.
- `src/components/work/`, `src/components/client-story/`, `src/components/about/`, `src/components/services/`, `src/components/contact/`, `src/components/layout/` — page-specific component groups for `/work`, `/work/[clientId]`, `/about`, `/services`, `/contact`, and the global `navigation.tsx`/`footer.tsx`.
- `src/data/` — the site's content layer (clients, projects, services, testimonials, social campaigns, reels/showreels, philosophy, about copy, navigation, site config, category taxonomy, and the derived accessor functions like `getFeaturedProjects`, `getClientStories`, `getServicesForCategories`). Treat this as correct and load-bearing; only change it when a task explicitly calls for a content/data change.
- `src/lib/validations/contact.ts`, `src/lib/resend.ts`, `src/app/api/contact/route.ts` — the contact form pipeline (Zod schema → Resend send). FROZEN; see above.

## Static assets

`public/` has a fixed structure — **never rename or move these folders**, and always load assets dynamically from this layout rather than hardcoding a placeholder:

```
public/
├── audio/          # ambient.mp3, hover.mp3, click.mp3, transition.mp3 — mono, loudness-matched
├── images/
│   ├── projects/   # project showcase screenshots (flat, no subfolders)
│   ├── social/     # per-client social content, one subfolder per client
│   ├── profile/    # personal/profile photo(s)
│   ├── logos/      # client wordmarks — color/<clientId>.png and mono/<clientId>.png
│   │                 (friends-perk-cafe has neither — fall back to a text wordmark)
│   └── posters/    # video poster frames (currently just hero.jpg)
└── videos/
    ├── hero/       # hero-desktop.webm, hero-desktop.mp4, hero-mobile.mp4
    ├── reels/      # short social reel clips
    └── showreel/   # longer demo-reel videos (distinct from reels/)
```

Quirks to account for when writing code that reads these directories (e.g. a gallery/section that maps over a folder):
- `public/images/social/` subfolder names and filenames have inconsistent casing (e.g. `cybernetix-01.jpg` vs `Cybernetix-03.jpg`, `pixelscape-01.jpg` vs `Pixelscape-10.jpg`) and mixed extensions (`.jpg`/`.jpeg`).
- `public/images/social/friends perk/` contains a literal space in the folder name, and its filenames also contain spaces (e.g. `friends-perk-cafe-vid-04.mp4` style names carry over into images too) — URL-encode/escape when referencing these paths.
- Prefer generating file lists at build time (e.g. `fs.readdirSync` in a server component, or `next/image` with explicit imports) over assuming a naming convention, given the casing inconsistency above.
- `public/images/projects/*.png` are large, uncompressed source PNGs (several 5–8MB, some 8000+ px tall) — see REBUILD-SPEC.md Phase 1 for the WebP/AVIF conversion pipeline (`scripts/optimise-images.mjs`). Originals are never deleted; optimized variants sit alongside them.

## Conventions to follow when building further

- Client-only libraries (GSAP, Lenis, R3F/`three`, Framer Motion) require `"use client"`. `src/app/layout.tsx` and most `page.tsx` files are server components — keep page-level routing server-rendered and push interactivity into leaf client components.
- When adding React Three Fiber content, dynamically import with `ssr: false` (see `hero.tsx`'s pattern for `hero-scene.tsx`). Per REBUILD-SPEC.md, the target architecture is one shared persistent `<Canvas>` via drei's `View`/`View.Port`, not one `<Canvas>` per section — don't add a second standalone `<Canvas>` without reading that spec.
- ESLint config (`eslint.config.mjs`) uses `FlatCompat` to extend `next/core-web-vitals` and `next/typescript`, with explicit `ignores` for `.next/**`, `out/**`, `build/**`, `next-env.d.ts`. If `npm run lint` starts failing on generated `.next/types/*` files after a Next.js upgrade, check this ignores list first.
- This is a **live production site** — never run `git commit`, `git push`, `vercel`, or `vercel deploy` from an agent session unless the user explicitly asks. `git status`/`git diff` are always fine.
