import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { contactCta, mainNav } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <Container className="flex flex-col gap-16 py-16 md:py-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="font-heading text-h3 text-text-primary md:max-w-md">
            {contactCta.label}
          </p>
          <Link
            href={contactCta.href}
            className={buttonVariants({ size: "lg" })}
          >
            {contactCta.label}
          </Link>
        </div>

        <div className="flex flex-col gap-8 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-small text-text-secondary transition-colors hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {siteConfig.socialLinks.length > 0 && (
            <nav className="flex flex-wrap gap-6">
              {siteConfig.socialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-small text-text-secondary transition-colors hover:text-text-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {siteConfig.email && (
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-small text-text-secondary transition-colors hover:text-text-primary"
            >
              {siteConfig.email}
            </a>
          )}

          {/* text-tertiary measured 3.7:1 (fails AA) — it's scoped to
              decorative use only, never body-readable text like this. */}
          <p className="text-caption text-text-secondary">
            &copy; {year} {siteConfig.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
