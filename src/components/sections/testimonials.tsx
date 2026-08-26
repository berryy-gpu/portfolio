"use client";

/**
 * REBUILD-SPEC.md section 09 — getFeaturedTestimonials() only, and
 * returns null when that's empty (it is, right now — testimonials.ts has
 * no real entries yet). Built and ready for whenever real testimonials
 * exist; nothing invented to fill the gap in the meantime.
 */

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SplitTextReveal } from "@/components/motion/split-text";
import { Container } from "@/components/ui/container";
import { getClientById, getClientLogoDimensions, getClientLogoPath } from "@/data/clients";
import { getFeaturedTestimonials } from "@/data/testimonials";

export function Testimonials() {
  const testimonials = getFeaturedTestimonials();
  const [index, setIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const current = testimonials[index];
  const client = current.clientId ? getClientById(current.clientId) : undefined;
  const logo = current.clientId ? getClientLogoPath(current.clientId, "color") : undefined;
  const dimensions = current.clientId ? getClientLogoDimensions(current.clientId) : undefined;

  const goTo = (delta: number) => {
    setIndex((prev) => (prev + delta + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-expansive">
      <Container width="reading">
        <div className="flex flex-col items-center gap-8 text-center">
          <SplitTextReveal
            key={current.id}
            as="p"
            preset="maskUp"
            trigger="mount"
            className="font-heading text-h2 text-text-primary"
          >
            {current.quote}
          </SplitTextReveal>

          <div className="flex items-center gap-3">
            {logo && dimensions && client && (
              <Image
                src={logo}
                alt={client.name}
                width={dimensions.width}
                height={dimensions.height}
                className="h-6 w-auto object-contain"
              />
            )}
            <span className="font-mono text-caption tracking-caption text-text-secondary uppercase">
              {current.author}
              {current.role ? ` — ${current.role}` : ""}
            </span>
          </div>

          {testimonials.length > 1 && (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => goTo(-1)}
                aria-label="Previous testimonial"
                className="text-text-secondary transition-colors hover:text-text-primary"
              >
                <ChevronLeft aria-hidden size={20} />
              </button>
              <button
                type="button"
                onClick={() => goTo(1)}
                aria-label="Next testimonial"
                className="text-text-secondary transition-colors hover:text-text-primary"
              >
                <ChevronRight aria-hidden size={20} />
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
