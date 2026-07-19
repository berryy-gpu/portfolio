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
