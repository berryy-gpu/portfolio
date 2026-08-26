/**
 * REBUILD-SPEC.md 4d — /services, above the closing CTA. Real Q&A copy
 * only, from data/faq.ts; returns null while that's empty rather than
 * shipping placeholder questions.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getFaqItems } from "@/data/faq";

export function Faq() {
  const items = getFaqItems();

  if (items.length === 0) return null;

  return (
    <section className="py-expansive">
      <Container width="reading">
        <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />

        <Accordion multiple>
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="font-heading text-h3 text-text-primary hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-body text-text-secondary">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
