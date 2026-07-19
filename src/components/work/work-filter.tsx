"use client";

/**
 * A deliberately quiet filter — underlined text tabs, not a bordered
 * pill toolbar. Per the brief: filtering shouldn't dominate the page or
 * make it feel like an application.
 */

import { cn } from "@/lib/utils";
import type { WorkMediaType } from "@/data/work";

interface WorkFilterOption {
  id: WorkMediaType | null;
  label: string;
}

const options: WorkFilterOption[] = [
  { id: null, label: "All" },
  { id: "campaigns", label: "Campaigns" },
  { id: "motion", label: "Motion" },
];

interface WorkFilterProps {
  active: WorkMediaType | null;
  onSelect: (type: WorkMediaType | null) => void;
}

export function WorkFilter({ active, onSelect }: WorkFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter Work sections"
      className="flex flex-wrap gap-6"
    >
      {options.map((option) => {
        const isActive = active === option.id;

        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onSelect(option.id)}
            aria-pressed={isActive}
            className={cn(
              "rounded-sm border-b-2 pb-1 text-small tracking-caption transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive
                ? "border-accent text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
