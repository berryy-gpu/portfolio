import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { PageTransition } from "@/components/layout/page-transition";
import { Preloader } from "@/components/layout/preloader";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SoundToggle } from "@/components/layout/sound-toggle";
import { ParticleField } from "@/components/motion/particle-field";
import { Providers } from "@/components/providers/providers";
import { siteConfig } from "@/data/site";
import { siteUrl } from "@/lib/site-url";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const defaultTitle = `${siteConfig.name} — ${siteConfig.tagline}`;
const defaultDescription = siteConfig.tagline ?? siteConfig.name;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s — ${siteConfig.name}` },
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteUrl,
  image: `${siteUrl}${siteConfig.avatar}`,
  ...(siteConfig.description && { description: siteConfig.description }),
  ...(!siteConfig.description &&
    siteConfig.tagline && { description: siteConfig.tagline }),
  ...(siteConfig.email && { email: siteConfig.email }),
  ...(siteConfig.socialLinks.length > 0 && {
    sameAs: siteConfig.socialLinks.map((link) => link.url),
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@300,400,500,700&f[]=general-sans@300,400,500,600,700&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          // z-[1000] intentionally matches zIndex.loading (motion-tokens.ts)
          // rather than importing it — Tailwind's `focus:` variant needs a
          // statically-analyzable literal class at build time, so a JS
          // constant can't be interpolated in here the way every other
          // z-index in the codebase uses the shared object directly via an
          // inline style. Keep this numeric literal in sync with
          // zIndex.loading if that token ever changes.
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1000] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-text-primary"
        >
          Skip to content
        </a>
        <Providers>
          <ParticleField />
          <Preloader />
          <PageTransition />
          <ScrollProgress />
          <SoundToggle />
          <Navigation />
          {/* Navigation is fixed (transparent at scroll 0), so ordinary
              pages need this top offset to clear it. The one exception is
              a full-bleed hero section that WANTS the nav floating over
              it — that section cancels this out itself (e.g. -mt-16)
              rather than this padding being conditional here. */}
          <main id="main-content" className="flex flex-1 flex-col pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
