import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientAmbientGlow } from "@/components/client-story/client-ambient-glow";
import { ClientCaseStudyBody } from "@/components/client-story/client-case-study-body";
import { ClientHero } from "@/components/client-story/client-hero";
import { ClientMotionShowcase } from "@/components/client-story/client-motion-showcase";
import { ClientNextProject } from "@/components/client-story/client-next-project";
import { ClientSidebar } from "@/components/client-story/client-sidebar";
import { ClientSocialGallery } from "@/components/client-story/client-social-gallery";
import { ClientTestimonial } from "@/components/client-story/client-testimonial";
import { Container } from "@/components/ui/container";
import { getCaseStudyByClientId } from "@/data/case-studies";
import { getClientSectionCopy } from "@/data/client-presentation";
import {
  getAdjacentClientIds,
  getAllClientIds,
  getClientStoryDescription,
  getClientStoryDetail,
} from "@/data/client-story";

/** The site's own real accent token — the fallback for clients with no
 *  researched/approved atmosphere entry (client-atmosphere.ts), never a
 *  guessed brand colour. */
const DEFAULT_ACCENT = "#a64f39";

interface ClientStoryPageProps {
  params: Promise<{ clientId: string }>;
}

export function generateStaticParams() {
  return getAllClientIds().map((clientId) => ({ clientId }));
}

export async function generateMetadata({
  params,
}: ClientStoryPageProps): Promise<Metadata> {
  const { clientId } = await params;
  const story = getClientStoryDetail(clientId);
  if (!story) return {};

  return {
    title: story.client.name,
    description: getClientStoryDescription(story),
  };
}

/**
 * Clients read exactly one case study before deciding — structured as an
 * article: Hero, sticky-sidebar + brief/approach/outcome body, a
 * testimonial pull-quote (omitted if none), the social gallery, a video
 * section for video-only clients, then the next-project block.
 *
 * "Has a real website project" (screenshots to show) and "has real
 * case-study prose" (case-studies.ts) are independent facts, not the
 * same thing — a client can have one without the other. Three real
 * states, not two:
 *   - Neither (friends-perk-cafe): gallery-only variant, no empty
 *     article shell built around missing content.
 *   - Project but no case-study prose (ay-architects, for now — see
 *     REBUILD-AUDIT.md): Hero + Sidebar render with the real images,
 *     the case-study body just doesn't — never invented brief/approach/
 *     outcome text standing in for it.
 *   - Both: the full article.
 */
export default async function ClientStoryPage({ params }: ClientStoryPageProps) {
  const { clientId } = await params;
  const story = getClientStoryDetail(clientId);

  if (!story) {
    notFound();
  }

  const { next } = getAdjacentClientIds(story.client.id);
  const caseStudy = getCaseStudyByClientId(story.client.id);
  const socialCopy = getClientSectionCopy(story.client.id, "social");
  const motionCopy = getClientSectionCopy(story.client.id, "motion");
  const hasMotion = story.reels.length > 0 || story.showreels.length > 0;
  const accent = story.atmosphere?.accent ?? DEFAULT_ACCENT;

  if (!story.project && !caseStudy) {
    return (
      <>
        <ClientAmbientGlow color={accent} />
        <Container className="flex flex-col gap-4 py-generous md:py-expansive">
          {story.atmosphere?.mood && (
            <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
              {story.atmosphere.mood}
            </span>
          )}
          <h1 className="font-heading text-display-xl tracking-display text-text-primary">
            {story.client.name}
          </h1>
        </Container>

        {story.socialCampaign && (
          <ClientSocialGallery campaign={story.socialCampaign} copy={socialCopy} />
        )}
        {hasMotion && (
          <ClientMotionShowcase reels={story.reels} showreels={story.showreels} copy={motionCopy} />
        )}
        <ClientNextProject nextId={next} />
      </>
    );
  }

  return (
    <>
      <ClientAmbientGlow color={accent} />
      <ClientHero story={story} />

      {(story.services.length > 0 || caseStudy) && (
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_1fr]">
          <ClientSidebar story={story} />
          {caseStudy && <ClientCaseStudyBody caseStudy={caseStudy} project={story.project} />}
        </Container>
      )}

      <ClientTestimonial clientId={story.client.id} />

      {story.socialCampaign && (
        <ClientSocialGallery campaign={story.socialCampaign} copy={socialCopy} />
      )}
      {hasMotion && (
        <ClientMotionShowcase reels={story.reels} showreels={story.showreels} copy={motionCopy} />
      )}

      <ClientNextProject nextId={next} />
    </>
  );
}
