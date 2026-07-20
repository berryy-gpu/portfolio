import { Container } from "@/components/ui/container";

export default function ServicesLoading() {
  return (
    <div className="py-generous md:py-expansive">
      <Container>
        <div className="flex max-w-4xl flex-col gap-4">
          <div className="h-4 w-20 animate-pulse rounded-pill bg-surface" />
          <div className="h-16 w-full animate-pulse rounded-md bg-surface md:h-24" />
          <div className="h-6 w-72 max-w-full animate-pulse rounded-md bg-surface" />
        </div>
      </Container>

      <Container>
        <div className="mt-16 flex flex-col gap-16 md:mt-24">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4 md:flex-row md:gap-16">
              <div className="h-10 w-32 animate-pulse rounded-md bg-surface md:w-48" />
              <div className="flex max-w-2xl flex-1 flex-col gap-4">
                <div className="h-8 w-full animate-pulse rounded-md bg-surface" />
                <div className="h-16 w-full animate-pulse rounded-md bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
