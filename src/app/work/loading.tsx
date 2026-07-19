import { Container } from "@/components/ui/container";

/**
 * Route-level loading UI (Next.js App Router convention). Mirrors the
 * intro + filter + first gallery rows closely enough to avoid a jarring
 * shift on arrival; doesn't attempt to mirror every section exactly.
 */
export default function WorkLoading() {
  return (
    <div className="py-generous md:py-expansive">
      <Container>
        <div className="flex max-w-2xl flex-col gap-4">
          <div className="h-4 w-16 animate-pulse rounded-pill bg-surface" />
          <div className="h-16 w-full animate-pulse rounded-md bg-surface md:h-24" />
          <div className="h-6 w-72 max-w-full animate-pulse rounded-md bg-surface" />
        </div>
      </Container>

      <Container>
        <div className="mt-16 flex gap-6 md:mt-24" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-5 w-16 animate-pulse rounded-sm bg-surface"
            />
          ))}
        </div>

        <div
          className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3"
          aria-hidden="true"
        >
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="mb-6 aspect-[4/5] w-full animate-pulse rounded-lg border border-border bg-surface"
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
