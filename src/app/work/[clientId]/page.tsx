import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientAmbientGlow } from "@/components/client-story/client-ambient-glow";
import { ClientHero } from "@/components/client-story/client-hero";
import { ClientMotionShowcase } from "@/components/client-story/client-motion-showcase";
import { ClientProcess } from "@/components/client-story/client-process";
import { ClientSocialGallery } from "@/components/client-story/client-social-gallery";
import { ClientStoryNav } from "@/components/client-story/client-story-nav";
import { ClientWebsiteShowcase } from "@/components/client-story/client-website-showcase";
import {
  getAdjacentClientIds,
  getAllClientIds,
  getClientStoryDescription,
  getClientStoryDetail,
  type ClientStoryDetail,
} from "@/data/client-story";
import {
  getClientSectionCopy,
  getClientSectionEmphasis,
  getClientSectionOrder,
  type ClientSectionId,
} from "@/data/client-presentation";

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

/** Renders one content section, or null if this client has no data for
 *  it — the section-order/copy config decides HOW, the story data
 *  decides WHETHER. */
function renderSection(sectionId: ClientSectionId, story: ClientStoryDetail) {
  const clientId = story.client.id;
  const copy = getClientSectionCopy(clientId, sectionId);

  switch (sectionId) {
    case "website":
      return story.project ? (
        <ClientWebsiteShowcase
          key={sectionId}
          project={story.project}
          copy={copy}
          emphasis={getClientSectionEmphasis(clientId, sectionId)}
        />
      ) : null;
    case "social":
      return story.socialCampaign ? (
        <ClientSocialGallery
          key={sectionId}
          campaign={story.socialCampaign}
          copy={copy}
        />
      ) : null;
    case "motion":
      return story.reels.length > 0 || story.showreels.length > 0 ? (
        <ClientMotionShowcase
          key={sectionId}
          reels={story.reels}
          showreels={story.showreels}
          copy={copy}
        />
      ) : null;
    case "process":
      return <ClientProcess key={sectionId} copy={copy} />;
    default:
      return null;
  }
}

export default async function ClientStoryPage({
  params,
}: ClientStoryPageProps) {
  const { clientId } = await params;
  const story = getClientStoryDetail(clientId);

  if (!story) {
    notFound();
  }

  const { prev, next } = getAdjacentClientIds(story.client.id);
  const sectionOrder = getClientSectionOrder(story.client.id);

  return (
    <>
      <ClientAmbientGlow color={story.atmosphere.accent} />
      <ClientHero story={story} />
      {sectionOrder.map((sectionId) => renderSection(sectionId, story))}
      <ClientStoryNav prevId={prev} nextId={next} />
    </>
  );
}
