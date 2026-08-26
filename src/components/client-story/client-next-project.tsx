"use client";

/**
 * Full-viewport block for the next client in workOrder. Scrolling into
 * it fills a progress rule; reaching 100% auto-navigates through the
 * transition layer (usePageTransition's beginTransition — the same path
 * TransitionLink uses). Cancellable by scrolling back up (progress just
 * reverses, nothing has fired yet). NEVER auto-navigates under
 * prefers-reduced-motion — that renders a plain TransitionLink instead,
 * with no scroll-triggered machinery attached at all.
 */

import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { TransitionLink } from "@/components/layout/transition-link";
import { usePageTransition } from "@/components/providers/transition-provider";
import { getClientById, type ClientId } from "@/data/clients";
import { useScrollScrub } from "@/hooks/use-scroll-scrub";
import { gsap } from "@/lib/gsap";

interface ClientNextProjectProps {
  nextId?: ClientId;
}

export function ClientNextProject({ nextId }: ClientNextProjectProps) {
  const prefersReducedMotion = useReducedMotion();
  const ruleRef = useRef<HTMLDivElement>(null);
  const hasNavigatedRef = useRef(false);
  const { beginTransition } = usePageTransition();
  const nextClient = nextId ? getClientById(nextId) : undefined;

  const scrubRef = useScrollScrub<HTMLDivElement>({
    start: "top bottom",
    end: "bottom bottom",
    scrub: true,
    build: (_container, baseVars) => {
      const rule = ruleRef.current;
      if (!rule || !nextClient) return;

      gsap.fromTo(
        rule,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            ...baseVars,
            onUpdate: (self) => {
              if (self.progress >= 1 && !hasNavigatedRef.current) {
                hasNavigatedRef.current = true;
                beginTransition(`/work/${nextClient.id}`, nextClient.name);
              } else if (self.progress < 1) {
                hasNavigatedRef.current = false;
              }
            },
          },
        }
      );
    },
  });

  if (!nextClient) return null;

  if (prefersReducedMotion) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center gap-8 border-t border-border">
        <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
          Next Project
        </span>
        <TransitionLink
          href={`/work/${nextClient.id}`}
          label={nextClient.name}
          className="font-heading text-display text-text-primary transition-colors hover:text-accent"
        >
          {nextClient.name}
        </TransitionLink>
      </section>
    );
  }

  return (
    <section
      ref={scrubRef}
      className="flex min-h-screen flex-col items-center justify-center gap-8 border-t border-border"
    >
      <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
        Next Project
      </span>
      <span className="font-heading text-display text-text-primary">
        {nextClient.name}
      </span>
      <div className="h-px w-40 bg-border">
        <div ref={ruleRef} className="h-full origin-left scale-x-0 bg-accent" />
      </div>
    </section>
  );
}
