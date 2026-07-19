"use client";

/**
 * Explore Client Stories — luxury editorial, not cards. Oversized
 * typography dominates each row; a huge, near-invisible "ghost" index
 * numeral sits behind the client name for depth; an underline draws in
 * on hover; the "Enter Story" arrow is magnetic (pulls gently toward
 * the cursor within a small radius, springs back on leave) as the
 * page's one contained magnetic-button moment. Each row's supporting
 * facts are real, derived counts (see getClientStories in data/work.ts)
 * — never invented copy.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent as ReactPointerEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { getClientDisciplineLabels, getClientStories } from "@/data/work";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

const MAGNET_RADIUS = 50;

function MagneticArrow() {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18 });
  const springY = useSpring(y, { stiffness: 250, damping: 18 });

  if (prefersReducedMotion) {
    return <ArrowRight className="h-4 w-4" aria-hidden="true" />;
  }

  const handleMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.4);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.4);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <span
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="inline-flex"
      style={{ padding: MAGNET_RADIUS / 2.5 }}
    >
      <motion.span style={{ x: springX, y: springY }} className="inline-flex">
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </motion.span>
    </span>
  );
}

export function ClientStories() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='client-story']",
    duration: duration.slow,
    ease: gsapEasing.entrance,
    y: 16,
    stagger: 0.1,
  });

  const stories = getClientStories();

  if (stories.length === 0) {
    return null;
  }

  return (
    <Section
      spacing="cinematic"
      header={{
        eyebrow: "Explore Client Stories",
        title: "Every client, one story each",
        description:
          "The full process, screenshots, and results live in each client's own story.",
      }}
    >
      <div ref={containerRef} className="flex flex-col">
        {stories.map((story, index) => {
          const disciplines = getClientDisciplineLabels(story.categoryIds);

          return (
            <Link
              key={story.client.id}
              href={`/work/${story.client.id}`}
              data-reveal="client-story"
              aria-label={`Enter ${story.client.name}'s story`}
              className="group relative flex flex-col gap-4 overflow-hidden border-b border-border py-expansive transition-colors last:border-b-0 hover:bg-surface/20 focus-visible:bg-surface/20 focus-visible:outline-none md:flex-row md:items-center md:justify-between md:gap-12"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 left-0 select-none font-heading text-display text-text-primary/5 md:-top-10 md:text-display-xl"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="relative flex flex-col gap-3">
                <h3 className="font-heading text-h1 text-text-primary transition-colors group-hover:text-accent md:text-display">
                  {story.client.name}
                </h3>
                <span className="block h-px w-0 bg-accent transition-[width] duration-500 group-hover:w-24" />
                {disciplines.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {disciplines.map((label) => (
                      <Badge key={label}>{label}</Badge>
                    ))}
                  </div>
                )}
                {story.summaryLine && (
                  <p className="text-small text-text-secondary">
                    {story.summaryLine}
                  </p>
                )}
              </div>

              <span className="relative flex shrink-0 items-center gap-2 text-small text-text-secondary transition-colors group-hover:text-text-primary">
                Enter Story
                <MagneticArrow />
              </span>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
