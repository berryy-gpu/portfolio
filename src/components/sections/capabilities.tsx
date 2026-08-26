"use client";

/**
 * REBUILD-SPEC.md section 05 — the six services as full-width editorial
 * rows (not cards). Hover translates the title toward --accent and eases
 * the row taller (96px -> 132px) to make room, while a shared
 * CursorFollowPreview shows that row's previewImage, if it has one.
 * Touch/low: static rows, no preview, no height change — this only
 * mounts the preview/hover-follow machinery on hover-capable,
 * non-reduced-motion pointers.
 */

import { useState } from "react";
import { useReducedMotion } from "framer-motion";

import { TransitionLink } from "@/components/layout/transition-link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { CursorFollowPreview } from "@/components/motion/cursor-follow-preview";
import { getCategoryById } from "@/data/categories";
import { services } from "@/data/services";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export function Capabilities() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const showPreview = canHover && !prefersReducedMotion;

  if (services.length === 0) return null;

  const sortedServices = [...services].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const activeService = sortedServices.find((service) => service.id === activeId);

  return (
    <section>
      <Container>
        <ul onMouseLeave={() => setActiveId(null)}>
          {sortedServices.map((service, index) => {
            const isActive = showPreview && activeId === service.id;

            return (
              <li key={service.id} className="border-b border-border">
                <TransitionLink
                  href={`/services#${service.id}`}
                  label={service.title}
                  onPointerEnter={() => setActiveId(service.id)}
                  className={cn(
                    "group flex items-center justify-between gap-6 transition-[height] duration-300 ease-out",
                    isActive ? "h-[132px]" : "h-24"
                  )}
                >
                  <span className="font-mono text-caption tracking-caption text-text-tertiary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "flex-1 font-heading text-h2 text-text-primary transition-[transform,color] duration-300 ease-out",
                      isActive && "translate-x-6 text-accent"
                    )}
                  >
                    {service.title}
                  </span>
                  <span className="hidden gap-2 md:flex">
                    {service.categoryIds.map((id) => {
                      const category = getCategoryById(id);
                      return category ? <Badge key={id}>{category.label}</Badge> : null;
                    })}
                  </span>
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </Container>

      {showPreview && (
        <CursorFollowPreview
          image={
            activeService?.previewImage
              ? {
                  src: activeService.previewImage.src,
                  alt: activeService.previewImage.alt,
                  width: 340,
                  height: 240,
                }
              : null
          }
        />
      )}
    </section>
  );
}
