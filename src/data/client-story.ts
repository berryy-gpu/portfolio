import { getCategoryById, type CategoryId } from "./categories";
import { getClientAtmosphere, type ClientAtmosphere } from "./client-atmosphere";
import { clients, type Client, type ClientId } from "./clients";
import { getProjectsByClientId, type Project } from "./projects";
import { getReelsByClientId, type Reel } from "./reels";
import { getShowreelsByClientId, type Showreel } from "./showreels";
import type { Service } from "./services";
import {
  getSocialCampaignsByClientId,
  type SocialCampaign,
} from "./socialCampaigns";
import { siteConfig } from "./site";
import { workOrder } from "./work";
import { getServicesForCategories } from "@/lib/get-services-for-categories";

export interface ClientStoryDetail {
  client: Client;
  atmosphere: ClientAtmosphere;
  /** A client's real website project, if they have one. */
  project?: Project;
  /** A client's real social campaign, if they have one. */
  socialCampaign?: SocialCampaign;
  reels: Reel[];
  showreels: Showreel[];
  categoryIds: CategoryId[];
  services: Service[];
}

export function getClientStoryDetail(
  clientId: string
): ClientStoryDetail | undefined {
  const client = clients.find((candidate) => candidate.id === clientId);
  if (!client) return undefined;

  const [project] = getProjectsByClientId(client.id);
  const [socialCampaign] = getSocialCampaignsByClientId(client.id);
  const reels = getReelsByClientId(client.id);
  const showreels = getShowreelsByClientId(client.id);

  const categoryIds = Array.from(
    new Set([
      ...(project?.categoryIds ?? []),
      ...reels.flatMap((reel) => reel.categoryIds),
      ...showreels.flatMap((showreel) => showreel.categoryIds),
    ])
  );

  return {
    client,
    atmosphere: getClientAtmosphere(client.id),
    project,
    socialCampaign,
    reels,
    showreels,
    categoryIds,
    services: getServicesForCategories(categoryIds),
  };
}

/** Shared by the client story page's metadata and its Open Graph image,
 *  so the "real disciplines, by [name]" copy is defined once. */
export function getClientStoryDescription(story: ClientStoryDetail): string {
  const disciplines = story.categoryIds
    .map((id) => getCategoryById(id)?.label)
    .filter((label): label is string => Boolean(label))
    .join(", ");

  return disciplines
    ? `${story.client.name}: ${disciplines}, by ${siteConfig.name}.`
    : `${story.client.name}, a project by ${siteConfig.name}.`;
}

export function getAllClientIds(): ClientId[] {
  return [...workOrder];
}

export function getAdjacentClientIds(clientId: ClientId): {
  prev?: ClientId;
  next?: ClientId;
} {
  const index = workOrder.indexOf(clientId);
  if (index === -1) return {};
  return {
    prev: workOrder[index - 1],
    next: workOrder[index + 1],
  };
}
