/**
 * A short --accent rule, then index + caption in mono. Renders nothing
 * when `caption` is absent — never a placeholder, never an invented
 * caption standing in for a real one that doesn't exist yet.
 */

import { cn } from "@/lib/utils";

interface ImageCaptionProps {
  index: number;
  caption?: string;
  className?: string;
}

export function ImageCaption({ index, caption, className }: ImageCaptionProps) {
  if (!caption) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div aria-hidden="true" className="h-px w-8 bg-accent" />
      <p className="font-mono text-caption tracking-caption text-text-secondary">
        {String(index + 1).padStart(2, "0")} — {caption}
      </p>
    </div>
  );
}
