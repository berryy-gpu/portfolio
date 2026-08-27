import type { ClientId } from "./clients";
import type { TestimonialImagePath } from "./assets";

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  clientId?: ClientId;
  quote: string;
  order?: number;
}

export const testimonials: Testimonial[] = [];

/** Empty until real quote-based testimonials exist for a specific
 *  client's case-study page (see client-testimonial.tsx on
 *  /work/[clientId]) — unrelated to testimonialCards below, which is a
 *  different, already-populated feature (the pre-rendered image wall). */
export function getFeaturedTestimonials(): Testimonial[] {
  return [...testimonials].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getTestimonialByClientId(clientId: string): Testimonial | undefined {
  return testimonials.find((testimonial) => testimonial.clientId === clientId);
}

export interface TestimonialCard {
  client: string;
  src: TestimonialImagePath;
  alt: string;
}

/**
 * Pre-rendered testimonial card images — quote, stars, client logo, name,
 * and category all baked into the picture itself, matching the site's own
 * colour system. These are the Testimonial Wall's content (homepage +
 * /services); alt text stays purely factual ("X testimonial for Baran
 * Haider") rather than re-describing the quote, since restating it risks
 * drifting from the real words already in the image.
 */
export const testimonialCards: TestimonialCard[] = [
  {
    client: "Eternal VIP Concierge",
    src: "/images/testimonials/testimonial-eternal-vip-concierge.webp",
    alt: "Eternal VIP Concierge testimonial for Baran Haider",
  },
  {
    client: "Pixelscape",
    src: "/images/testimonials/testimonial-pixelscape.webp",
    alt: "Pixelscape testimonial for Baran Haider",
  },
  {
    client: "Aureate 1.61",
    src: "/images/testimonials/testimonial-aureate-161.webp",
    alt: "Aureate 1.61 testimonial for Baran Haider",
  },
  {
    client: "Hi-Hat Productions",
    src: "/images/testimonials/testimonial-hi-hat-productions.webp",
    alt: "Hi-Hat Productions testimonial for Baran Haider",
  },
  {
    client: "Clix-CRM",
    src: "/images/testimonials/testimonial-clix-crm.webp",
    alt: "Clix-CRM testimonial for Baran Haider",
  },
  {
    client: "Cybernetix",
    src: "/images/testimonials/testimonial-cybernetix.webp",
    alt: "Cybernetix testimonial for Baran Haider",
  },
];

export function getTestimonialCards(): TestimonialCard[] {
  return testimonialCards;
}
