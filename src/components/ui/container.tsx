import { type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const widths = {
  reading: "max-w-3xl",
  showcase: "max-w-7xl",
  full: "max-w-none",
} as const;

interface ContainerProps {
  // Constrained to element types that accept className + children — a bare
  // ElementType includes void elements (e.g. <img>) whose children prop is
  // `never`, which breaks JSX's children-type inference for this component.
  as?: ElementType<{ className?: string; children?: ReactNode }>;
  width?: keyof typeof widths;
  className?: string;
  children: ReactNode;
}

export function Container({
  as: Tag = "div",
  width = "showcase",
  className,
  children,
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-6 md:px-10", widths[width], className)}>
      {children}
    </Tag>
  );
}
