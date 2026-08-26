"use client";

/**
 * SVG <textPath> repeating around a circle, rotating via a pure CSS
 * animation (~18s linear infinite, Tailwind's built-in `spin` keyframe
 * at a custom duration) — no JS-driven animation loop, no dependency.
 * A static glyph sits at the centre, never rotating. Removed entirely
 * under prefers-reduced-motion rather than frozen mid-spin.
 *
 * REBUILD-SPEC.md/Step 3c: use in EXACTLY ONE place (the homepage final
 * CTA) — don't reuse this elsewhere.
 */

import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface RotatingBadgeProps {
  /** Repeated around the ring — kept short, real site copy, not invented. */
  text: string;
  glyph: ReactNode;
  className?: string;
}

const REPEAT_COUNT = 4;
const SEPARATOR = "  •  ";

export function RotatingBadge({ text, glyph, className }: RotatingBadgeProps) {
  const pathId = useId();
  const ringText = Array.from({ length: REPEAT_COUNT }, () => text).join(SEPARATOR) + SEPARATOR;

  return (
    <div className={cn("relative inline-flex h-24 w-24 items-center justify-center", className)}>
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full motion-reduce:hidden [animation:spin_18s_linear_infinite]"
      >
        <defs>
          <path id={pathId} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
        </defs>
        <text className="fill-text-secondary font-mono text-[7px] tracking-[0.15em] uppercase">
          <textPath href={`#${pathId}`}>{ringText}</textPath>
        </text>
      </svg>

      <span className="relative z-10 flex h-10 w-10 items-center justify-center text-text-primary">
        {glyph}
      </span>
    </div>
  );
}
