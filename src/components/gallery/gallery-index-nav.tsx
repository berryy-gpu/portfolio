"use client";

/**
 * /gallery's project index (polish pass, step 4) — a sticky pill row
 * listing every group by name, derived from the actual grouped data.
 * Active state (which pill is highlighted) comes from an
 * IntersectionObserver watching each `[data-gallery-section]`, not from
 * the click itself — this reflects real scroll position at all times,
 * including from a page-load deep link or the browser's own back/forward
 * scroll restoration. Clicking a pill scrolls via Lenis (falling back to
 * native scrollIntoView) so it stays consistent with the rest of the
 * site's smooth-scroll system rather than a raw hash jump.
 */

import { useEffect, useRef, useState } from "react";

import { useLenis } from "@/components/providers/smooth-scroller";
import { zIndex } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

interface GalleryIndexNavProps {
  groups: { id: string; name: string }[];
}

export function GalleryIndexNav({ groups }: GalleryIndexNavProps) {
  const [activeId, setActiveId] = useState<string | null>(groups[0]?.id ?? null);
  const lenis = useLenis();
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-gallery-section]")
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top <= b.boundingClientRect.top ? a : b));
        setActiveId(topMost.target.id.replace(/^gallery-/, ""));
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [groups]);

  const scrollToGroup = (id: string) => {
    const target = document.getElementById(`gallery-${id}`);
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, { duration: 1 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (groups.length === 0) return null;

  return (
    <div
      style={{ zIndex: zIndex.elevated }}
      className="sticky top-16 border-b border-border bg-background/80 backdrop-blur-functional"
    >
      <div
        ref={rowRef}
        role="tablist"
        aria-label="Jump to gallery section"
        className="flex snap-x gap-2 overflow-x-auto px-6 py-4 md:flex-wrap md:overflow-visible md:px-10"
      >
        {groups.map((group) => {
          const isActive = activeId === group.id;

          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => scrollToGroup(group.id)}
              className={cn(
                "relative shrink-0 snap-start rounded-pill border border-border bg-surface px-4 py-2 font-mono text-caption tracking-caption uppercase transition-colors",
                isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {group.name}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent transition-opacity duration-200",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
