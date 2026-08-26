import type { CategoryId } from "./categories";
import type { Client, ClientId } from "./clients";
import { clients } from "./clients";
import { getCategoryById } from "./categories";
import { getProjectsByClientId } from "./projects";
import { getReelsByClientId } from "./reels";
import { getShowreelsByClientId } from "./showreels";
import { getSocialCampaignsByClientId } from "./socialCampaigns";

/** The content groups the Work page's filter toggles. Client Stories
 *  and the cinematic intro aren't filterable — everything else is a
 *  specific medium. */
export type WorkMediaType = "campaigns" | "motion";

/** The homepage-style explicit ordering: builds first, care second,
 *  social/video-only clients last. Exported so Client Story pages can
 *  reuse the same sequence for prev/next nav. */
export const workOrder: ClientId[] = [
  "ay-architects",
  "cybernetix",
  "pixelscape",
  "aureate",
  "clix",
  "hihat",
  "zoe-ministries",
  "azura",
  "thompson",
  "eternal",
  "friends-perk-cafe",
];

function getClientCategoryIds(clientId: ClientId): CategoryId[] {
  const projectCategoryIds = getProjectsByClientId(clientId).flatMap(
    (project) => project.categoryIds
  );
  const reelCategoryIds = getReelsByClientId(clientId).flatMap(
    (reel) => reel.categoryIds
  );
  const showreelCategoryIds = getShowreelsByClientId(clientId).flatMap(
    (showreel) => showreel.categoryIds
  );

  return Array.from(
    new Set([...projectCategoryIds, ...reelCategoryIds, ...showreelCategoryIds])
  );
}

export interface ClientStory {
  client: Client;
  categoryIds: CategoryId[];
  /** A short, honest line built from real counts — never invented copy. */
  summaryLine: string;
}

/**
 * A real, honest one-line summary of what a client's work included,
 * assembled from actual counts (projects, social posts, reels,
 * showreels) rather than written marketing copy.
 *
 * "build" and "care" projects produce DIFFERENT lines — a care client
 * (ongoing development on a site someone else designed and built) must
 * never read as "Website design & development", which would tell
 * visitors we designed and built a site we did not.
 */
function getClientSummaryLine(clientId: ClientId): string {
  const parts: string[] = [];
  const clientProjects = getProjectsByClientId(clientId);

  if (clientProjects.some((project) => project.engagement === "build")) {
    parts.push("Website design & development");
  }
  if (clientProjects.some((project) => project.engagement === "care")) {
    parts.push("Ongoing website development");
  }

  const socialCount = getSocialCampaignsByClientId(clientId).flatMap(
    (campaign) => campaign.images
  ).length;
  if (socialCount > 0) {
    parts.push(`${socialCount} published social posts`);
  }

  const reelCount = getReelsByClientId(clientId).length;
  if (reelCount > 0) {
    parts.push(`${reelCount} reel${reelCount === 1 ? "" : "s"}`);
  }

  const showreelCount = getShowreelsByClientId(clientId).length;
  if (showreelCount > 0) {
    parts.push(`${showreelCount} showreel${showreelCount === 1 ? "" : "s"}`);
  }

  return parts.join(" · ");
}

export function getClientStories(): ClientStory[] {
  return workOrder
    .map((clientId) => clients.find((client) => client.id === clientId))
    .filter((client): client is Client => Boolean(client))
    .map((client) => ({
      client,
      categoryIds: getClientCategoryIds(client.id),
      summaryLine: getClientSummaryLine(client.id),
    }));
}

export function getClientDisciplineLabels(categoryIds: CategoryId[]): string[] {
  return categoryIds
    .map((id) => getCategoryById(id)?.label)
    .filter((label): label is string => Boolean(label));
}

export interface ClientPreviewVideo {
  src: string;
  poster: string;
  alt: string;
}

/**
 * A real clip to preview on hover for /work's client rows
 * (REBUILD-SPEC.md 3f) — the client's first reel (preferred, they're cut
 * for short-form viewing) or first showreel, posterized with the
 * client's first real social image. Only clients with real reel/showreel
 * assets have one; everyone else gets undefined rather than a borrowed
 * clip standing in for content that doesn't exist.
 */
export function getClientPreviewVideo(clientId: ClientId): ClientPreviewVideo | undefined {
  const clip = getReelsByClientId(clientId)[0] ?? getShowreelsByClientId(clientId)[0];
  if (!clip) return undefined;

  const posterImage = getSocialCampaignsByClientId(clientId).flatMap(
    (campaign) => campaign.images
  )[0];
  if (!posterImage) return undefined;

  return { src: clip.src, poster: encodeURI(posterImage.src), alt: clip.title };
}
