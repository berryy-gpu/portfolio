/**
 * Testimonial Wall — six pre-rendered testimonial card images (quote,
 * stars, client logo, name, category all baked into the picture itself,
 * matching the site's own colour system). Dropped in as next/image
 * images, not re-typed as JSX text — re-describing the quote in alt text
 * would risk drifting from the real words already in the image, so alt
 * text stays purely factual ("X testimonial for Baran Haider").
 *
 * Reuses the existing Marquee infinite-scroll primitive (already used by
 * ClientMarquee/AboutTools) rather than a new mechanism — Marquee itself
 * duplicates whatever children it's given into two back-to-back copies
 * for the seamless loop, so the six cards are only ever passed once here.
 * Marquee already goes fully static under prefers-reduced-motion/low
 * tier; `pauseOnHover` (opt-in on Marquee) freezes it on pointer hover.
 */

import Image from "next/image";

import { Marquee } from "@/components/motion/marquee";
import { SectionHeader } from "@/components/ui/section-header";
import { Container } from "@/components/ui/container";
import { getTestimonialCards } from "@/data/testimonials";

const CARD_WIDTH = 941;
const CARD_HEIGHT = 1672;

export function TestimonialWall() {
  const cards = getTestimonialCards();

  if (cards.length === 0) return null;

  return (
    <section className="py-expansive">
      <Container>
        <SectionHeader eyebrow="Client Feedback" title="What clients say" />
      </Container>

      <Marquee baseSpeed={26} pauseOnHover itemClassName="items-center gap-6 px-3">
        {cards.map((card, index) => (
          <div
            key={card.src}
            className="h-[320px] shrink-0 overflow-hidden rounded-lg border border-border md:h-[420px]"
          >
            <Image
              src={card.src}
              alt={card.alt}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              priority={index < 2}
              quality={90}
              className="h-full w-auto object-cover"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
