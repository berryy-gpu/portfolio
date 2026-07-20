import { Container } from "@/components/ui/container";

export default function AboutLoading() {
  return (
    <div className="py-generous md:py-expansive">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
          <div className="flex max-w-3xl flex-col gap-4">
            <div className="h-4 w-16 animate-pulse rounded-pill bg-surface" />
            <div className="h-16 w-full animate-pulse rounded-md bg-surface md:h-24" />
          </div>
          <div className="h-32 w-32 shrink-0 animate-pulse rounded-full bg-surface md:h-40 md:w-40" />
        </div>
      </Container>
    </div>
  );
}
