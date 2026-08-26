/**
 * The personal narrative, broken out of a single narrow centred column
 * (the FIX 4 rebuild) into an asymmetric editorial layout: on lg+, a
 * sticky mono section label sits in a 3-column margin beside a 7-column
 * paragraph measure. The four real storyParagraphs split into two
 * labeled groups (background, then approach) with a full-bleed accent
 * rule and a pull-quote between them.
 *
 * The pull-quote is copied verbatim from storyParagraphs[2] below — not
 * new copy. Pull-quotes duplicating a phrase already in the body text is
 * the normal, traditional meaning of the term (a quote "pulled" out and
 * enlarged near where it already appears), not content invention.
 *
 * Below lg the grid collapses to a single column and the label/rule/
 * quote all still render in document order. maskUp reveal per paragraph,
 * unchanged.
 */

import { SplitTextReveal } from "@/components/motion/split-text";
import { Container } from "@/components/ui/container";
import { aboutContent } from "@/data/about";

const BACKGROUND_PARAGRAPHS = aboutContent.storyParagraphs.slice(0, 2);
const APPROACH_PARAGRAPHS = aboutContent.storyParagraphs.slice(2);

const PULL_QUOTE =
  "My goal was never just to launch a website. It's to build things people actually remember using.";

function ParagraphGroup({
  label,
  paragraphs,
}: {
  label: string;
  paragraphs: string[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-10 lg:gap-12">
      <div className="lg:col-span-3">
        <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase lg:sticky lg:top-32">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-8 lg:col-span-7">
        {paragraphs.map((paragraph, index) => (
          <SplitTextReveal
            key={index}
            as="p"
            preset="maskUp"
            className="text-body-lg text-text-secondary first:text-text-primary"
          >
            {paragraph}
          </SplitTextReveal>
        ))}
      </div>
    </div>
  );
}

export function AboutStory() {
  return (
    <section className="py-expansive md:py-cinematic">
      <Container>
        <div className="flex flex-col gap-16">
          <ParagraphGroup label="01 — Background" paragraphs={BACKGROUND_PARAGRAPHS} />

          <div className="flex flex-col gap-12">
            <div className="relative left-1/2 w-screen -translate-x-1/2">
              <div className="h-px w-full bg-accent" />
            </div>
            <p className="mx-auto max-w-3xl text-center font-heading text-h2 text-text-primary">
              &ldquo;{PULL_QUOTE}&rdquo;
            </p>
          </div>

          <ParagraphGroup label="02 — Approach" paragraphs={APPROACH_PARAGRAPHS} />
        </div>
      </Container>
    </section>
  );
}
