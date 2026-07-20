"use client";

/**
 * The website section of a Client Story — reuses AnimatedWebsitePreview
 * exactly as built for the homepage/Work page (same browser-frame,
 * hover-scroll interaction) for the primary full-page preview, plus a
 * simple screenshot gallery below for clients with more than one real
 * project image. Only rendered when the client actually has a website
 * project — no invented preview for clients that don't.
 *
 * Copy and emphasis are props, not hardcoded — see
 * src/data/client-presentation.ts, the single source for how (not
 * whether) this section presents itself per client.
 */

import Image from "next/image";

import { Section } from "@/components/ui/section";
import { AnimatedWebsitePreview } from "@/components/ui/animated-website-preview";
import type {
  ClientSectionCopy,
  ClientSectionEmphasis,
} from "@/data/client-presentation";
import type { Project } from "@/data/projects";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

interface ClientWebsiteShowcaseProps {
  project: Project;
  copy: ClientSectionCopy;
  emphasis: ClientSectionEmphasis;
}

export function ClientWebsiteShowcase({
  project,
  copy,
  emphasis,
}: ClientWebsiteShowcaseProps) {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='screenshot']",
    duration: duration.normal,
    ease: gsapEasing.entrance,
    y: 20,
    stagger: 0.08,
  });

  const isLarge = emphasis === "large";

  return (
    <Section
      spacing="default"
      containerWidth={isLarge ? "full" : "showcase"}
      header={copy}
    >
      <div className="flex flex-col gap-12">
        {project.websitePreview && (
          <AnimatedWebsitePreview
            preview={project.websitePreview}
            className={
              isLarge ? "mx-auto w-full max-w-6xl" : "mx-auto w-full max-w-4xl"
            }
          />
        )}

        {project.images.length > 0 && (
          <div
            ref={containerRef}
            className={
              isLarge
                ? "grid grid-cols-1 gap-8 sm:grid-cols-2"
                : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            }
          >
            {project.images.map((image) => (
              <div
                key={image.src}
                data-reveal="screenshot"
                className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-surface"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={
                    isLarge
                      ? "(min-width: 1024px) 600px, 100vw"
                      : "(min-width: 1024px) 400px, 100vw"
                  }
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
