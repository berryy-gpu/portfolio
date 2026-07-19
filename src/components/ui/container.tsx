import { type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const widths = {
  reading: "max-w-3xl",
  showcase: "max-w-7xl",
  full: "max-w-none",
} as const;

interface ContainerProps {
  as?: ElementType;
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
