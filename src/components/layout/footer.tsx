/**
 * siteConfig.name bleeds off the page's bottom edge at display-xxl — the
 * footer container clips it via overflow-hidden plus a downward shift, so
 * only the top of the letterforms show before the page ends. Three
 * columns (nav / socials / location+clock+availability) above that.
 * Socials render nothing at all when siteConfig.socialLinks is empty —
 * no placeholder, no invented links.
 */

import { LiveClock } from "@/components/ui/live-clock";
import { TransitionLink } from "@/components/layout/transition-link";
import { MaskLabel } from "@/components/motion/mask-label";
import { contactCta, mainNav } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();
  const navItems = [...mainNav, contactCta];

  return (
    <footer className="overflow-hidden border-t border-border">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-16 px-6 py-16 md:px-10 md:py-24">
        <p className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
          &copy; {year} {siteConfig.name}
        </p>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
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

          {siteConfig.socialLinks.length > 0 && (
            <nav aria-label="Social links" className="flex flex-col gap-4">
              {siteConfig.socialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-fit font-heading text-h4 text-text-secondary transition-colors hover:text-text-primary"
                >
                  <MaskLabel label={link.label} />
                </a>
              ))}
            </nav>
          )}

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
          </div>
        </div>

        <div aria-hidden="true" className="-mx-6 -mb-16 overflow-hidden md:-mx-10 md:-mb-24">
          <p className="translate-y-[18%] font-heading text-display-xxl leading-none whitespace-nowrap text-text-primary select-none">
            {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
