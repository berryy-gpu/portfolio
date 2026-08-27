import { Container } from "@/components/ui/container";

export default function ContactLoading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-expansive">
      <Container width="reading">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="h-4 w-16 animate-pulse rounded-pill bg-surface" />
          <div className="h-12 w-full animate-pulse rounded-md bg-surface md:h-16" />
          <div className="h-6 w-64 max-w-full animate-pulse rounded-md bg-surface" />
          <div className="h-10 w-72 max-w-full animate-pulse rounded-md bg-surface" />
        </div>
      </Container>
    </div>
  );
}
