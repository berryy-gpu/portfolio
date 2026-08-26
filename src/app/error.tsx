"use client";

import Link from "next/link";
import { useEffect } from "react";

import { SplitTextReveal } from "@/components/motion/split-text";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center py-expansive text-center">
      <Container width="reading" className="flex flex-col items-center gap-8">
        <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
          Error
        </span>
        <SplitTextReveal
          as="h1"
          preset="maskUp"
          trigger="mount"
          className="font-heading text-display tracking-display text-text-primary"
        >
          Something went wrong.
        </SplitTextReveal>
        <p className="text-body-lg text-text-secondary">
          An unexpected error occurred. You can try again, or head back home.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Try again
          </button>
          <Link href="/" className={buttonVariants({ variant: "ghost", size: "lg" })}>
            Back to home
          </Link>
        </div>
      </Container>
    </section>
  );
}
