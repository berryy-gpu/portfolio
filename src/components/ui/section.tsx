import { type ReactNode, type Ref } from "react";

import { Container } from "./container";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

type SectionSpacing = "default" | "cinematic";

const spacingClasses: Record<SectionSpacing, string> = {
  default: "py-generous md:py-expansive",
  cinematic: "py-expansive md:py-cinematic",
};

interface SectionHeaderConfig {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  width?: "reading" | "full";
}

interface SectionProps {
  spacing?: SectionSpacing;
  containerWidth?: "reading" | "showcase" | "full";
  header?: SectionHeaderConfig;
  contentRef?: Ref<HTMLDivElement>;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

/**
 * Standardizes the section/Container/SectionHeader/content-wrapper shape
 * that most homepage sections share, so each one only has to state what's
 * actually different about it (spacing tier, container width, header
 * copy, content layout) rather than repeating the wrapper markup.
 *
 * Scroll reveal setup deliberately stays with the calling component: the
 * selector name and timing are section-specific, so each section still
 * calls useScrollReveal itself and passes the resulting ref in as
 * contentRef. Section only handles where that ref gets attached.
 *
 * Not every section needs this — a section with a genuinely different
 * shape (a different content element, no header, a non-standard border
 * treatment) is better left explicit than forced through extra props
 * here. See client-trust-strip.tsx for a section that opts out.
 */
export function Section({
  spacing = "default",
  containerWidth,
  header,
  contentRef,
  className,
  contentClassName,
  children,
}: SectionProps) {
  return (
    <section className={cn(spacingClasses[spacing], className)}>
      <Container width={containerWidth}>
        {header && <SectionHeader {...header} />}
        <div ref={contentRef} className={contentClassName}>
          {children}
        </div>
      </Container>
    </section>
  );
}
