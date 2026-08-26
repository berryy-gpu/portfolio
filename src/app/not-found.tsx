import Link from "next/link";

import { SplitTextReveal } from "@/components/motion/split-text";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center py-expansive text-center">
      <Container width="reading" className="flex flex-col items-center gap-8">
        <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
          404
        </span>
        <SplitTextReveal
          as="h1"
          preset="maskUp"
          trigger="mount"
          className="font-heading text-display tracking-display text-text-primary"
        >
          This page doesn&apos;t exist.
        </SplitTextReveal>
        <p className="text-body-lg text-text-secondary">
          The link might be broken, or the page may have moved.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Back to home
        </Link>
      </Container>
    </section>
  );
}
