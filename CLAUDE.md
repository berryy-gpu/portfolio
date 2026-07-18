# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is a fresh foundation for a personal portfolio site. Only the app shell, providers, and tooling exist — no portfolio content/sections have been built yet. The site will be built section by section in later sessions; don't assume any page content beyond a placeholder `/` route exists. Real project/social/profile media already exists under `public/` (see **Static assets** below) — use it directly, don't build placeholder-image logic for content that already has a real asset.

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
- **Tailwind CSS v4** — no `tailwind.config.*` file; theme tokens (colors, radii, sidebar/chart vars) live as CSS custom properties in `src/app/globals.css` under `@theme inline`, `:root`, and `.dark`.
- **shadcn/ui**, configured via `components.json` with the `base-nova` style, `neutral` base color, and **`@base-ui/react`** as the primitive layer (not Radix — this is shadcn's current default, so don't assume Radix primitives/APIs when reading or extending `src/components/ui/*`).
- **GSAP + ScrollTrigger**, **Lenis** (smooth scroll), **Framer Motion**, **React Three Fiber** (`@react-three/fiber`, `@react-three/drei`, `three`), **Lucide React** for icons, **class-variance-authority** / **clsx** / **tailwind-merge** for variant/class composition.

## Architecture

- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge). Use this for all conditional/merged className composition.
- `src/lib/gsap.ts` — the only place `ScrollTrigger` is registered (guarded by `typeof window !== "undefined"`). Always import `gsap`/`ScrollTrigger` from here, not directly from `"gsap"`, so registration stays centralized.
- `src/hooks/use-isomorphic-layout-effect.ts` — `useLayoutEffect` on the client / `useEffect` on the server. Use this instead of `useLayoutEffect` directly in any component that runs GSAP setup, to avoid SSR warnings.
- `src/components/providers/` — the app's provider composition root.
  - `providers.tsx` exports `<Providers>`, mounted once in `src/app/layout.tsx` around `children`. Add any new app-wide context/provider (theme, etc.) here rather than editing `layout.tsx` directly.
  - `smooth-scroller.tsx` wires **Lenis** into the **GSAP ticker** (`gsap.ticker.add`, `lagSmoothing(0)`) and forwards Lenis scroll events to `ScrollTrigger.update`. This is the integration point that makes Lenis smooth-scroll and GSAP ScrollTrigger agree on scroll position — if you add scroll-driven animations, they should just work against this setup without any extra wiring.
- `src/components/ui/` — shadcn-generated primitives only (e.g. `button.tsx`). Don't hand-edit generated variant files beyond what `shadcn add`/config would produce; treat them as regenerable.
- No `src/components/sections/` or similar yet — create that convention when the first real portfolio section is built, following the pattern above (client components co-located with the hooks/animation logic they own).

## Static assets

`public/` has a fixed structure — **never rename or move these folders**, and always load assets dynamically from this layout rather than hardcoding a placeholder:

```
public/
├── images/
│   ├── projects/   # project showcase screenshots (flat, no subfolders)
│   ├── social/     # per-client social content, one subfolder per client
│   └── profile/    # personal/profile photo(s)
└── videos/
    ├── reels/      # short social reel clips
    └── showreel/   # longer demo-reel videos (distinct from reels/)
```

Quirks to account for when writing code that reads these directories (e.g. a gallery/section that maps over a folder):
- `public/images/social/` subfolder names and filenames have inconsistent casing (e.g. `cybernetix-01.jpg` vs `Cybernetix-03.jpg`, `pixelscape-01.jpg` vs `Pixelscape-10.jpg`) and mixed extensions (`.jpg`/`.jpeg`).
- `public/images/social/friends perk/` contains a literal space in the folder name, and its filenames also contain spaces (e.g. `friends-perk-cafe 01.jpeg`) — URL-encode/escape when referencing these paths.
- Nothing in `src/` references these paths yet — when you wire up sections, prefer generating file lists at build time (e.g. `fs.readdirSync` in a server component, or `next/image` with explicit imports) over assuming a naming convention, given the casing inconsistency above.

## Conventions to follow when building further

- Client-only libraries (GSAP, Lenis, R3F/`three`, Framer Motion) require `"use client"` — the App Router root (`layout.tsx`) and `page.tsx` are currently server components; keep them that way and push interactivity into leaf client components.
- When adding React Three Fiber content, wrap it in its own client component (no shared Canvas wrapper exists yet — don't build one speculatively until there's an actual 3D section).
- ESLint config (`eslint.config.mjs`) uses `FlatCompat` to extend `next/core-web-vitals` and `next/typescript`, with explicit `ignores` for `.next/**`, `out/**`, `build/**`, `next-env.d.ts`. If `npm run lint` starts failing on generated `.next/types/*` files after a Next.js upgrade, check this ignores list first.
