/**
 * Body: brief / approach / outcome as editorial blocks from
 * src/data/case-studies.ts, alternating full-bleed and contained images
 * with clipReveal and counter-parallax. A client with fewer than three
 * real project images just shows fewer image blocks — never a repeated
 * or invented one.
 */

import { Container } from "@/components/ui/container";
import { ImageCaption } from "@/components/ui/image-caption";
import { Parallax } from "@/components/motion/parallax";
import { RevealImage } from "@/components/motion/reveal-image";
import type { CaseStudy } from "@/data/case-studies";
import type { Project } from "@/data/projects";

interface ClientCaseStudyBodyProps {
  caseStudy: CaseStudy;
  project?: Project;
}

const BLOCKS: { key: "brief" | "approach" | "outcome"; label: string }[] = [
  { key: "brief", label: "The Brief" },
  { key: "approach", label: "The Approach" },
  { key: "outcome", label: "The Outcome" },
];

export function ClientCaseStudyBody({ caseStudy, project }: ClientCaseStudyBodyProps) {
  const images = project?.images ?? [];

  return (
    <div className="flex flex-col gap-24 py-generous md:py-expansive">
      {BLOCKS.map((block, index) => {
        const image = images[index];
        const isFullBleed = index % 2 === 0;

        return (
          <div key={block.key} className="flex flex-col gap-8">
            <Container width="reading">
              <div className="flex flex-col gap-3">
                <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
                  {block.label}
                </span>
                <p className="font-heading text-h2 text-text-primary">
                  {caseStudy[block.key]}
                </p>
              </div>
            </Container>

            {image && (
              <Parallax offset={isFullBleed ? -40 : -24}>
                <Container width={isFullBleed ? "full" : "showcase"}>
                  <RevealImage
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="100vw"
                    containerClassName={
                      isFullBleed
                        ? "relative aspect-video w-full"
                        : "relative mx-auto aspect-4/3 w-full max-w-4xl rounded-lg"
                    }
                  />
                  <ImageCaption
                    index={index}
                    caption={image.caption}
                    className={isFullBleed ? undefined : "mx-auto max-w-4xl"}
                  />
                </Container>
              </Parallax>
            )}
          </div>
        );
      })}
    </div>
  );
}
