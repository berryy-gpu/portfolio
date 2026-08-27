"use client";

/**
 * Explore Client Stories — editorial rows using the same
 * CursorFollowPreview primitive as Capabilities (REBUILD-SPEC.md /work
 * spec: "Client rows with the cursor-following preview primitive from
 * section 05"). Each row's supporting facts are real, derived counts
 * (getWebsiteClientStories in data/work.ts) — never invented copy. A
 * client with no real website preview image just gets no floating
 * preview for its row — never a placeholder.
 *
 * Grouped by real engagement type (build / care) rather than a flat
 * list — "build" and "care" are different services and must never blur
 * together, and each client row also carries its own engagement Badge
 * for the same reason. Step 8: /work is websites only now (media-only
 * clients moved to /gallery), so there's no third "Social & Motion"
 * group here any more — every story in this list has real engagement.
 * `activeEngagement` (from WorkFilter, owned by work-experience.tsx)
 * narrows which group(s) render; `null` shows both.
 */

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useState } from "react";

import { TransitionLink } from "@/components/layout/transition-link";
import { CursorFollowPreview } from "@/components/motion/cursor-follow-preview";
import { Badge } from "@/components/ui/badge";
import {
  getClientLogoDimensions,
  getClientLogoPath,
  type ClientId,
} from "@/data/clients";
import {
  ENGAGEMENT_LABELS,
  getClientEngagement,
  getProjectsByClientId,
} from "@/data/projects";
import {
  getClientDisciplineLabels,
  getClientPreviewVideo,
  getWebsiteClientStories,
  type ClientStory,
} from "@/data/work";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useQualityTier } from "@/hooks/use-quality-tier";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { duration, gsapEasing } from "@/lib/motion-tokens";
import type { WorkEngagementFilter } from "./work-filter";

interface ClientGroup {
  label: string;
  engagement: "build" | "care";
  stories: ClientStory[];
}

function groupStoriesByEngagement(stories: ClientStory[]): ClientGroup[] {
  const builds: ClientStory[] = [];
  const care: ClientStory[] = [];

  for (const story of stories) {
    const engagement = getClientEngagement(story.client.id);
    if (engagement === "build") builds.push(story);
    else if (engagement === "care") care.push(story);
  }

  return [
    { label: "Builds", engagement: "build" as const, stories: builds },
    { label: "Ongoing Care", engagement: "care" as const, stories: care },
  ].filter((group) => group.stories.length > 0);
}

interface ClientStoriesProps {
  activeEngagement?: WorkEngagementFilter;
}

export function ClientStories({ activeEngagement = null }: ClientStoriesProps) {
  const containerRef = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal='client-story']",
    duration: duration.slow,
    ease: gsapEasing.entrance,
    y: 16,
    stagger: 0.1,
  });

  const [activeId, setActiveId] = useState<ClientId | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const tier = useQualityTier();
  const showPreview = canHover && !prefersReducedMotion;
  const allowVideoPreview = showPreview && tier !== "low";

  const stories = getWebsiteClientStories();

  if (stories.length === 0) {
    return null;
  }

  const groups = groupStoriesByEngagement(stories).filter(
    (group) => !activeEngagement || group.engagement === activeEngagement
  );
  const activeProject = activeId ? getProjectsByClientId(activeId)[0] : undefined;
  const activeImage = activeProject?.websitePreview?.image;
  const activeVideo = allowVideoPreview && activeId ? getClientPreviewVideo(activeId) : undefined;

  return (
    <section className="py-expansive">
      <div className="flex flex-col gap-3 px-6 pb-12 md:px-10">
        <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
          Explore Client Stories
        </span>
        <h2 className="font-heading text-h2 text-text-primary">Every client, one story each</h2>
      </div>

      <div ref={containerRef} onMouseLeave={() => setActiveId(null)}>
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col">
            <span className="px-6 pt-8 pb-2 font-mono text-caption tracking-caption text-text-tertiary uppercase md:px-10">
              {group.label}
            </span>
            <div className="flex flex-col">
              {group.stories.map((story) => {
                const disciplines = getClientDisciplineLabels(story.categoryIds);
                const engagement = getClientEngagement(story.client.id);
                const logo = getClientLogoPath(story.client.id, "mono");
                const logoDimensions = getClientLogoDimensions(story.client.id);

                return (
                  <TransitionLink
                    key={story.client.id}
                    href={`/work/${story.client.id}`}
                    label={story.client.name}
                    withHoverSound
                    data-reveal="client-story"
                    onPointerEnter={() => setActiveId(story.client.id)}
                    aria-label={`Enter ${story.client.name}'s story`}
                    className="group relative flex flex-col gap-4 overflow-hidden border-b border-border bg-surface px-6 py-expansive transition-colors last:border-b-0 hover:bg-surface-elevated md:flex-row md:items-center md:justify-between md:gap-12 md:px-10"
                  >
                    {logo && logoDimensions && (
                      <Image
                        src={logo}
                        alt=""
                        aria-hidden="true"
                        width={logoDimensions.width}
                        height={logoDimensions.height}
                        className="pointer-events-none absolute top-1/2 right-6 h-24 w-auto -translate-y-1/2 object-contain opacity-[0.06] md:right-12 md:h-32"
                      />
                    )}

                    <div className="relative flex flex-col gap-3">
                      <h3 className="font-heading text-display text-text-primary transition-colors group-hover:text-accent">
                        {story.client.name}
                      </h3>
                      {(engagement || disciplines.length > 0) && (
                        <div className="flex flex-wrap items-center gap-2">
                          {engagement && (
                            <span className="font-mono text-caption tracking-caption text-accent uppercase">
                              {ENGAGEMENT_LABELS[engagement]}
                            </span>
                          )}
                          {disciplines.map((label) => (
                            <Badge key={label}>{label}</Badge>
                          ))}
                        </div>
                      )}
                      {story.summaryLine && (
                        <p className="text-small text-text-secondary">{story.summaryLine}</p>
                      )}
                    </div>

                    <span className="relative flex shrink-0 items-center gap-2 text-small text-text-secondary transition-colors group-hover:text-text-primary">
                      Enter Story
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>

                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
                    />
                  </TransitionLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showPreview && (
        <CursorFollowPreview
          image={
            activeImage
              ? { src: activeImage.src, alt: activeImage.alt, width: 340, height: 240 }
              : null
          }
          video={activeVideo}
        />
      )}
    </section>
  );
}
