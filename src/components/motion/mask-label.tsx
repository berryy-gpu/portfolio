/**
 * The site's link-hover grammar: one overflow-hidden span holding two
 * stacked copies of the label, the second in --accent — hovering swaps
 * them via a CSS-only translateY (relies on the ancestor link carrying
 * Tailwind's `group` class). Used by Navigation and Footer per
 * REBUILD-SPEC.md's "Link hover: maskUp label swap" instruction on both.
 * Pure CSS (no JS), so it's inert-safe under prefers-reduced-motion
 * without any extra handling — a swap with no transition still reads
 * fine, it just snaps instead of sliding.
 */

import { cn } from "@/lib/utils";

interface MaskLabelProps {
  label: string;
  className?: string;
}

export function MaskLabel({ label, className }: MaskLabelProps) {
  return (
    <span className="relative block overflow-hidden">
      <span
        className={cn(
          "block transition-transform duration-300 ease-out group-hover:-translate-y-full motion-reduce:transition-none",
          className
        )}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 block translate-y-full text-accent transition-transform duration-300 ease-out group-hover:translate-y-0 motion-reduce:transition-none",
          className
        )}
      >
        {label}
      </span>
    </span>
  );
}
