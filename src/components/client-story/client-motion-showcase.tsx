"use client";

/**
 * A single client's reels/showreels — reuses VideoPlayer unchanged.
 * Simpler than the Work page's Motion Design mosaic (no size hierarchy
 * needed for 2-4 clips) — a clean responsive grid is the right scale
 * for a client detail section.
 *
 * Copy is a prop, not hardcoded — see src/data/client-presentation.ts.
 */

import { Section } from "@/components/ui/section";
import { VideoPlayer } from "@/components/ui/video-player";
import type { ClientSectionCopy } from "@/data/client-presentation";
import type { Reel } from "@/data/reels";
import type { Showreel } from "@/data/showreels";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";

interface ClientMotionShowcaseProps {
  reels: Reel[];
  showreels: Showreel[];
  copy: ClientSectionCopy;
}

export function ClientMotionShowcase({
  reels,
  showreels,
  copy,
}: ClientMotionShowcaseProps) {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='motion-clip']",
    duration: duration.normal,
    ease: gsapEasing.entrance,
    y: 20,
    stagger: 0.1,
  });

  const clips = [...showreels, ...reels];

  if (clips.length === 0) {
    return null;
  }

  return (
    <Section spacing="default" header={copy}>
      <div
        ref={containerRef}
        className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:gap-8"
      >
        {clips.map((clip) => (
          <div key={clip.id} data-reveal="motion-clip">
            <VideoPlayer src={clip.src} title={clip.title} />
          </div>
        ))}
      </div>
    </Section>
  );
}
