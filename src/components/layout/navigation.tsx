"use client";

/**
 * Fixed top navigation — transparent at scroll 0, --surface at 80% with
 * backdrop-blur-functional past a small threshold. Hides on scroll down,
 * reveals on scroll up (tracked off Lenis's own scroll/direction, so it
 * agrees with the rest of the site's scroll truth rather than the native
 * window scroll position). Routes through TransitionLink — this is the
 * first real consumer of the Phase 4 transition system.
 */

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { TransitionLink } from "@/components/layout/transition-link";
import { MaskLabel } from "@/components/motion/mask-label";
import { useLenis } from "@/components/providers/smooth-scroller";
import { usePageTransition } from "@/components/providers/transition-provider";
import { contactCta, mainNav } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { duration, easing, zIndex } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

const HIDE_THRESHOLD_PX = 120;
const SCROLLED_THRESHOLD_PX = 8;

export function Navigation() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { phase } = usePageTransition();
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      firstMobileLinkRef.current?.focus();
    } else if (phase === "idle") {
      lenis?.start();
    }
  }, [isOpen, lenis, phase]);

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

  useEffect(() => {
    if (!lenis || prefersReducedMotion) return;

    const unsubscribe = lenis.on("scroll", (instance) => {
      setScrolled(instance.scroll > SCROLLED_THRESHOLD_PX);

      if (instance.scroll < HIDE_THRESHOLD_PX) {
        setHidden(false);
      } else if (instance.direction === 1) {
        setHidden(true);
      } else if (instance.direction === -1) {
        setHidden(false);
      }
    });

    return unsubscribe;
  }, [lenis, prefersReducedMotion]);

  const overlayTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: duration.fast, ease: easing.entrance };

  const linkContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  };

  const linkItemVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: duration.normal, ease: easing.hero },
    },
  };

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
        className={cn(
          "fixed inset-x-0 top-0 border-b transition-[background-color,border-color,transform] duration-300 ease-out",
          scrolled
            ? "border-border bg-background/80 backdrop-blur-functional"
            : "border-transparent bg-transparent",
          hidden && !isOpen && "-translate-y-full"
        )}
        style={{ zIndex: zIndex.navigation }}
      >
        <div className="flex h-16 items-center justify-between px-6 md:px-10">
          <TransitionLink
            href="/"
            label="Home"
            className="font-mono text-small tracking-caption text-text-primary uppercase"
          >
            {siteConfig.name}
          </TransitionLink>

          <nav className="hidden items-center gap-8 md:flex">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  withHoverSound
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative text-small transition-colors",
                    isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  <MaskLabel label={item.label} />
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute inset-x-0 -bottom-1 h-px bg-accent"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: duration.normal, ease: easing.standard }
                      }
                    />
                  )}
                </TransitionLink>
              );
            })}

            <div className="flex items-center gap-2 pl-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-success [animation-duration:3s]"
              />
              <TransitionLink
                href={contactCta.href}
                label={contactCta.label}
                className="group relative text-small text-text-secondary transition-colors hover:text-text-primary"
              >
                <MaskLabel label={contactCta.label} />
              </TransitionLink>
            </div>
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
            {isOpen ? <X aria-hidden size={24} /> : <Menu aria-hidden size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={overlayTransition}
            className="fixed inset-0 flex flex-col justify-between overflow-y-auto bg-background px-6 pt-24 pb-10 md:hidden"
            style={{ zIndex: zIndex.navigation }}
          >
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={prefersReducedMotion ? undefined : linkContainerVariants}
              className="flex flex-col gap-4"
            >
              {mainNav.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    variants={prefersReducedMotion ? undefined : linkItemVariants}
                    className="overflow-hidden"
                  >
                    <TransitionLink
                      ref={index === 0 ? firstMobileLinkRef : undefined}
                      href={item.href}
                      label={item.label}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block font-heading text-h1",
                        isActive ? "text-text-primary" : "text-text-secondary"
                      )}
                    >
                      {item.label}
                    </TransitionLink>
                  </motion.div>
                );
              })}
            </motion.nav>

            <TransitionLink
              href={contactCta.href}
              label={contactCta.label}
              className="font-mono text-caption tracking-caption text-text-secondary uppercase"
            >
              {contactCta.label}
            </TransitionLink>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
