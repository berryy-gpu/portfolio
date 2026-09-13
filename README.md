# Baran Haider — Portfolio

A premium personal portfolio built with Next.js 15, React 19, and TypeScript — a cinematic homepage, a Creative Showcase, per-client story pages, and editorial About/Services/Contact pages, all sharing one design and motion system.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (`@base-ui/react`) · GSAP + ScrollTrigger · Lenis · Framer Motion · React Three Fiber · React Hook Form + Zod · Nodemailer (SMTP).

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
| `SMTP_HOST` | Yes, in production | SMTP server hostname used by Nodemailer (`src/lib/mailer.ts`) to send the contact form's notification email. Without any one of the five `SMTP_*` variables, `getMailer()` returns null, `/api/contact` returns a 500, and the form shows an error state — it fails safely, it just won't send. |
| `SMTP_PORT` | Yes, in production | SMTP port, e.g. `465`. |
| `SMTP_SECURE` | Yes, in production | `"true"` or `"false"` (compared as a literal string, not cast with `Boolean(...)`) — whether to connect with TLS from the start. |
| `SMTP_USER` | Yes, in production | The authenticated SMTP account. Also used as the outgoing `from` address — most providers, Gmail included, reject a `from` that doesn't match the authenticated account. If using Gmail: this is the full Gmail address. |
| `SMTP_PASSWORD` | Yes, in production | The SMTP account's password. If using Gmail: this must be a [Google App Password](https://myaccount.google.com/apppasswords) (requires 2-Step Verification enabled first), not the normal account password. |

The contact form's recipient address is not an environment variable — it's `siteConfig.email` in `src/data/site.ts`.

## Deployment Notes

- Deploys cleanly to Vercel (or any Next.js-compatible host) with zero extra configuration beyond the environment variables above.
- Set all five `SMTP_*` variables in your host's environment variable settings (e.g. Vercel → Settings → Environment Variables, for both Production and Preview, followed by a redeploy) — `.env.local` is gitignored and never reaches the host on its own. Never commit real values to `.env.local` or anywhere else in the repo.
- `/work/[clientId]` is statically generated at build time via `generateStaticParams` — no server-side data fetching, no database.
- Set `NEXT_PUBLIC_SITE_URL` to the real production domain once known — it drives `metadataBase`, the sitemap, `robots.txt`, and Open Graph image URLs.
