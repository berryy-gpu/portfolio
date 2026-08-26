/**
 * Testimonial pull-quote via getTestimonialByClientId(), omitted
 * entirely if none — testimonials.ts has no real entries yet, so this
 * currently renders null for every client.
 */

import { Container } from "@/components/ui/container";
import type { ClientId } from "@/data/clients";
import { getTestimonialByClientId } from "@/data/testimonials";

export function ClientTestimonial({ clientId }: { clientId: ClientId }) {
  const testimonial = getTestimonialByClientId(clientId);
  if (!testimonial) return null;

  return (
    <section className="border-y border-border bg-surface/20 py-expansive">
      <Container width="reading">
        <blockquote className="flex flex-col items-center gap-4 text-center">
          <p className="font-heading text-h2 text-text-primary">&ldquo;{testimonial.quote}&rdquo;</p>
          <footer className="font-mono text-caption tracking-caption text-text-secondary uppercase">
            {testimonial.author}
            {testimonial.role ? ` — ${testimonial.role}` : ""}
          </footer>
        </blockquote>
      </Container>
    </section>
  );
}
