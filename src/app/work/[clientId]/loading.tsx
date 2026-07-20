import { Container } from "@/components/ui/container";

export default function ClientStoryLoading() {
  return (
    <div className="py-generous md:py-expansive">
      <Container>
        <div className="flex max-w-4xl flex-col gap-4">
          <div className="h-4 w-32 animate-pulse rounded-pill bg-surface" />
          <div className="h-16 w-full animate-pulse rounded-md bg-surface md:h-24" />
          <div className="h-5 w-48 animate-pulse rounded-md bg-surface" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-24 animate-pulse rounded-pill bg-surface" />
            <div className="h-6 w-24 animate-pulse rounded-pill bg-surface" />
          </div>
        </div>
      </Container>

      <Container>
        <div className="mt-16 aspect-[16/10] w-full max-w-4xl mx-auto animate-pulse rounded-lg border border-border bg-surface md:mt-24" />
      </Container>
    </div>
  );
}
