"use client";

/**
 * Closing navigation — prev/next client (same order as the Work page's
 * Explore Client Stories list) plus a way back to the full Work index.
 * Keeps the same restrained, typographic interaction language as the
 * rest of the site rather than introducing new card/button chrome here.
 */

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { getClientById, type ClientId } from "@/data/clients";

interface ClientStoryNavProps {
  prevId?: ClientId;
  nextId?: ClientId;
}

export function ClientStoryNav({ prevId, nextId }: ClientStoryNavProps) {
  const prevClient = prevId ? getClientById(prevId) : undefined;
  const nextClient = nextId ? getClientById(nextId) : undefined;

  return (
    <section className="border-t border-border py-generous md:py-expansive">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {prevClient ? (
              <Link
                href={`/work/${prevClient.id}`}
                className="group inline-flex items-center gap-2 rounded-sm text-small text-text-secondary transition-colors hover:text-text-primary focus-visible:text-text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <ArrowLeft
                  className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                {prevClient.name}
              </Link>
            ) : (
              <span />
            )}
          </div>

          <Link
            href="/work"
            className="text-small text-text-secondary transition-colors hover:text-text-primary focus-visible:text-text-primary focus-visible:outline-none"
          >
            Back to Work
          </Link>

          <div className="sm:text-right">
            {nextClient && (
              <Link
                href={`/work/${nextClient.id}`}
                className="group inline-flex items-center gap-2 rounded-sm text-small text-text-secondary transition-colors hover:text-text-primary focus-visible:text-text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {nextClient.name}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
