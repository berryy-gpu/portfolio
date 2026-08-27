"use client";

/**
 * REBUILD-SPEC.md's footer, structured with the existing elevation tokens
 * rather than flat page background: --surface + a --border top edge marks
 * it as a distinct zone. Three columns (real CTA / nav / location+clock+
 * availability+socials) above a copyright + back-to-top bar. The oversized
 * clipped siteConfig.name stays, but now sits BEHIND the content at ~8%
 * opacity (--text-tertiary) as texture rather than a wall of type on its
 * own line. Socials render nothing at all when siteConfig.socialLinks is
 * empty — no placeholder, no invented links.
 */

import { ArrowUp } from "lucide-react";

import { LiveClock } from "@/components/ui/live-clock";
import { TransitionLink } from "@/components/layout/transition-link";
import { MaskLabel } from "@/components/motion/mask-label";
import { useLenis } from "@/components/providers/smooth-scroller";
import { contactCta, mainNav } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export function Footer() {
  const lenis = useLenis();
  const year = new Date().getFullYear();
  const navItems = [...mainNav, contactCta];

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden opacity-[0.08]"
      >
        <p className="translate-y-[18%] font-heading text-display-xxl leading-none whitespace-nowrap text-text-tertiary select-none">
          {siteConfig.name}
        </p>
      </div>

      <div className="relative mx-auto flex max-w-[1800px] flex-col gap-16 px-6 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            {siteConfig.email && (
              <>
                <h2 className="font-heading text-h2 text-text-primary">Have a project?</h2>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="group relative w-fit font-mono text-h4 text-text-secondary transition-colors hover:text-text-primary"
                >
                  {siteConfig.email}
                  <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </a>
              </>
            )}
          </div>

          <nav aria-label="Footer navigation" className="flex flex-col gap-4">
            {navItems.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                label={item.label}
                className="group w-fit font-heading text-h4 text-text-secondary transition-colors hover:text-text-primary"
              >
                <MaskLabel label={item.label} />
              </TransitionLink>
            ))}
          </nav>

          <div className="flex flex-col gap-4 md:items-end md:text-right">
            {siteConfig.location && (
              <p className="font-mono text-caption tracking-caption text-text-secondary uppercase">
                {siteConfig.location}
              </p>
            )}
            <LiveClock className="font-mono text-caption tracking-caption text-text-tertiary tabular-nums uppercase" />
            <div className="flex items-center gap-2 md:flex-row-reverse">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-success [animation-duration:3s]"
              />
              <span className="font-mono text-caption tracking-caption text-text-secondary uppercase">
                Available for new work
              </span>
            </div>

            {siteConfig.socialLinks.length > 0 && (
              <nav aria-label="Social links" className="flex flex-col gap-2 md:items-end">
                {siteConfig.socialLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-fit font-mono text-caption tracking-caption text-text-secondary uppercase transition-colors hover:text-text-primary"
                  >
                    <MaskLabel label={link.label} />
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-8">
          <p className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
            &copy; {year} {siteConfig.name}
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2 font-mono text-caption tracking-caption text-text-secondary uppercase transition-colors hover:text-text-primary"
          >
            Back to top
            <ArrowUp
              aria-hidden="true"
              className="h-3 w-3 transition-transform duration-200 ease-out group-hover:-translate-y-1"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
