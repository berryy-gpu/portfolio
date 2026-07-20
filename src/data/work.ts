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

/** The homepage-style explicit ordering: website clients in their
 *  existing catalog order, then the two video-only clients. Exported so
 *  Client Story pages can reuse the same sequence for prev/next nav. */
export const workOrder: ClientId[] = [
  "cybernetix",
  "pixelscape",
  "aureate",
  "clix",
  "hihat",
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
 * showreels) rather than written marketing copy. Empty for a client
 * with none of these (shouldn't happen given the current roster, but
 * the function stays honest about it rather than assuming).
 */
function getClientSummaryLine(clientId: ClientId): string {
  const parts: string[] = [];

  if (getProjectsByClientId(clientId).length > 0) {
    parts.push("Website design & development");
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
