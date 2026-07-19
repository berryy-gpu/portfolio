import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  width?: "reading" | "full";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  width = "full",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-comfortable flex flex-col gap-3",
        align === "center" && "items-center text-center",
        width === "reading" && "max-w-3xl",
        align === "center" && width === "reading" && "mx-auto",
        className
      )}
    >
      {eyebrow && (
        <span className="text-caption tracking-caption text-text-secondary">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-h2 text-text-primary">{title}</h2>
      {description && (
        <p className="text-body text-text-secondary">{description}</p>
      )}
    </div>
  );
}
