"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useLenis } from "@/components/providers/smooth-scroller";
import { contactCta, mainNav } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { duration, easing, zIndex } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      firstMobileLinkRef.current?.focus();
    } else {
      lenis?.start();
    }
  }, [isOpen, lenis]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const overlayTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: duration.fast, ease: easing.entrance };

  return (
    <>
      {/*
        The mobile overlay below is intentionally NOT nested inside this
        header. backdrop-blur (backdrop-filter) makes an element a
        containing block for its position:fixed descendants — nesting the
        overlay here would position it relative to this 64px-tall header
        instead of the viewport. Verified by rendering: it collapsed to an
        ~80px sliver until moved out as a sibling.
      */}
      <header
        className="sticky top-0 border-b border-border bg-background/80 backdrop-blur-functional"
        style={{ zIndex: zIndex.navigation }}
      >
        <Container width="full" className="max-w-none">
          <div className="flex h-16 items-center justify-between px-6 md:px-10">
            <Link
              href="/"
              className="font-heading text-body font-medium text-text-primary"
            >
              {siteConfig.name}
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {mainNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "text-small transition-colors hover:text-text-primary",
                      isActive ? "text-text-primary" : "text-text-secondary"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link href={contactCta.href} className={buttonVariants()}>
                {contactCta.label}
              </Link>
            </nav>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="text-text-primary md:hidden"
            >
              {isOpen ? (
                <X aria-hidden size={24} />
              ) : (
                <Menu aria-hidden size={24} />
              )}
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={overlayTransition}
            className="fixed top-16 right-0 bottom-0 left-0 flex flex-col justify-between overflow-y-auto bg-background px-6 py-10 md:hidden"
            style={{ zIndex: zIndex.navigation }}
          >
            <nav className="flex flex-col gap-6">
              {mainNav.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    ref={index === 0 ? firstMobileLinkRef : undefined}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "font-heading text-h3",
                      isActive ? "text-text-primary" : "text-text-secondary"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href={contactCta.href}
              className={buttonVariants({ size: "lg", className: "w-full" })}
            >
              {contactCta.label}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
