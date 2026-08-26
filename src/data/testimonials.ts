import type { ClientId } from "./clients";

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  clientId?: ClientId;
  quote: string;
  order?: number;
}

export const testimonials: Testimonial[] = [];

/** Empty until real testimonials exist — the Testimonials section
 *  (REBUILD-SPEC.md section 09) renders null when this returns []. */
export function getFeaturedTestimonials(): Testimonial[] {
  return [...testimonials].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getTestimonialByClientId(clientId: string): Testimonial | undefined {
  return testimonials.find((testimonial) => testimonial.clientId === clientId);
}
