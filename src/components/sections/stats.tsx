"use client";

/**
 * REBUILD-SPEC.md section 08 — four figures counting up from 0 once
 * scrolled into view (the `counterUp` grammar). Every number comes from
 * getStats() (src/data/stats.ts), derived from real data at build time.
 */

import { useRef } from "react";

import { Container } from "@/components/ui/container";
import { getStats } from "@/data/stats";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { gsap } from "@/lib/gsap";
import { revealPresets } from "@/lib/reveal-presets";
import { cn } from "@/lib/utils";

export function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stats = getStats();
  const config = revealPresets.counterUp;

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { reduceMotion } = context.conditions as { reduceMotion: boolean };
      const numberEls = container.querySelectorAll<HTMLElement>("[data-stat-value]");

      if (reduceMotion) {
        numberEls.forEach((el) => {
          el.textContent = el.dataset.statValue ?? "0";
        });
        return;
      }

      numberEls.forEach((el) => {
        const target = Number(el.dataset.statValue ?? 0);
        const proxy = { value: 0 };
        gsap.to(proxy, {
          value: target,
          duration: config.duration,
          ease: config.ease,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(proxy.value));
          },
        });
      });
    });

    return () => mm.revert();
  }, [stats, config.duration, config.ease]);

  if (stats.length === 0) return null;

  return (
    <section className="border-y border-border py-expansive">
      <Container>
        <div ref={containerRef} className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={cn("flex flex-col gap-2 px-4", index > 0 && "border-l border-accent/30")}
            >
              <span
                data-stat-value={stat.value}
                className="font-heading text-display text-text-primary tabular-nums"
              >
                0
              </span>
              <span className="font-mono text-caption tracking-caption text-text-secondary uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
