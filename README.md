# Baran Haider — Portfolio

A premium personal portfolio built with Next.js 15, React 19, and TypeScript — a cinematic homepage, a Creative Showcase, per-client story pages, and editorial About/Services/Contact pages, all sharing one design and motion system.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (`@base-ui/react`) · GSAP + ScrollTrigger · Lenis · Framer Motion · React Three Fiber · React Hook Form + Zod · Resend.

See `CLAUDE.md` for the full architecture reference.

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build (also typechecks)
npm run start    # serve the production build
npm run lint     # ESLint
npx tsc --noEmit # typecheck only
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the real values:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No, but recommended once deployed | Canonical absolute URL used for `metadataBase`, the sitemap, `robots.txt`, and JSON-LD/Open Graph image URLs. Falls back to `http://localhost:3000`. |
| `RESEND_API_KEY` | Yes, in production | Sends the contact form's notification email via [Resend](https://resend.com). Without it, `/api/contact` returns a 500 and the form shows an error state — it fails safely, it just won't send. |
| `RESEND_FROM_EMAIL` | No | Sender address for outgoing mail. Must be on a domain verified in Resend to send at real volume. Defaults to Resend's `onboarding@resend.dev` sandbox sender, which works without domain verification but is meant for testing. |

The contact form's recipient address is not an environment variable — it's `siteConfig.email` in `src/data/site.ts`.

## Deployment Notes

- Deploys cleanly to Vercel (or any Next.js-compatible host) with zero extra configuration beyond the environment variables above.
- Set `RESEND_API_KEY` (and, once you have a verified sending domain, `RESEND_FROM_EMAIL`) in your host's environment variable settings — never commit real values to `.env.local` or anywhere else in the repo.
- `/work/[clientId]` is statically generated at build time via `generateStaticParams` — no server-side data fetching, no database.
- Set `NEXT_PUBLIC_SITE_URL` to the real production domain once known — it drives `metadataBase`, the sitemap, `robots.txt`, and Open Graph image URLs.
