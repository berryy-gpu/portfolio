export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * REBUILD-SPEC.md 4d's /services FAQ accordion — real Q&A copy only, no
 * placeholder or invented questions. Empty until real pairs are supplied;
 * components/services/faq.tsx returns null while this stays empty.
 */
export const faqItems: FaqItem[] = [];

export function getFaqItems(): FaqItem[] {
  return faqItems;
}
