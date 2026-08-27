"use client";

/**
 * REBUILD-SPEC.md section 07 — deliberately the slowest moment on the
 * page. The `settle` grammar (gentle fade-up) — now the rare exception,
 * not the site-wide default it used to be. Stage numbers sit at 20%
 * opacity so they read as structure, not content. A single connecting
 * rule draws down the whole sequence, scrubbed 1:1 to scroll. Nothing
 * else here, per spec.
 */

import { useRef } from "react";

import { Container } from "@/components/ui/container";
import { philosophyStages } from "@/data/philosophy";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useScrollScrub } from "@/hooks/use-scroll-scrub";
import { gsap } from "@/lib/gsap";

export function Process() {
  const ruleRef = useRef<HTMLDivElement>(null);

  const contentRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='process-stage']",
    preset: "settle",
  });

  const scrubRef = useScrollScrub<HTMLDivElement>({
    start: "top 60%",
    end: "bottom 60%",
    scrub: true,
    build: (_container, baseVars) => {
      const rule = ruleRef.current;
      if (!rule) return;
      gsap.fromTo(rule, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: baseVars });
    },
    reducedMotionFallback: () => {
      if (ruleRef.current) gsap.set(ruleRef.current, { scaleY: 1 });
    },
  });

  if (philosophyStages.length === 0) return null;

  return (
    <section className="py-expansive">
      <Container width="reading">
        <div ref={scrubRef} className="relative">
          <div
            ref={ruleRef}
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-0 w-px origin-top bg-border md:left-1/4"
          />
          <div ref={contentRef} className="flex flex-col gap-24">
            {philosophyStages.map((stage, index) => (
              <div
                key={stage.id}
                data-reveal="process-stage"
                className="grid gap-4 pl-8 md:grid-cols-[1fr_2fr] md:gap-12 md:pl-0"
              >
                <span className="font-heading text-display text-text-tertiary/20 md:text-right">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-h3 text-text-primary">{stage.title}</h3>
                  <p className="text-body text-text-secondary">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
