import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/**
 * Deliberately neutral/desaturated — no per-category color. The Visual
 * Identity System's category-tag palette question (collapse ten hues to a
 * few broad groups, or keep them distinct) was flagged as unresolved and
 * never settled, so this stays a single restrained style until that's
 * decided rather than guessing at ten colors now.
 */
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border border-border bg-surface px-3 py-1 text-caption tracking-caption text-text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}
