import type { SocialImagePath } from "./assets";
import type { CategoryId } from "./categories";
import type { ClientId } from "./clients";

export interface SocialImage {
  src: SocialImagePath;
  alt: string;
  /** Real intrinsic pixel dimensions — read from the actual files, used
   *  by the Campaign Gallery masonry so each tile keeps its true
   *  proportions with zero layout shift. */
  width: number;
  height: number;
}

export interface SocialCampaign {
  id: string;
  title: string;
  clientId: ClientId;
  categoryIds: CategoryId[];
  images: SocialImage[];
  order?: number;
}

export const socialCampaigns: SocialCampaign[] = [
  {
    id: "cybernetix-social",
    title: "Cybernetix — Social Content",
    clientId: "cybernetix",
    categoryIds: ["social-media", "marketing"],
    order: 1,
    images: [
      {
        src: "/images/social/cybernetix/cybernetix-01.jpg",
        alt: "Cybernetix — social post 1",
        width: 805,
        height: 801,
      },
      {
        src: "/images/social/cybernetix/cybernetix-02.jpg",
        alt: "Cybernetix — social post 2",
        width: 642,
        height: 797,
      },
      {
        src: "/images/social/cybernetix/Cybernetix-03.jpg",
        alt: "Cybernetix — social post 3",
        width: 642,
        height: 802,
      },
      {
        src: "/images/social/cybernetix/Cybernetix-04.jpg",
        alt: "Cybernetix — social post 4",
        width: 646,
        height: 797,
      },
      {
        src: "/images/social/cybernetix/Cybernetix-05.jpg",
        alt: "Cybernetix — social post 5",
        width: 636,
        height: 797,
      },
      {
        src: "/images/social/cybernetix/Cybernetix-06.jpg",
        alt: "Cybernetix — social post 6",
        width: 637,
        height: 797,
      },
      {
        src: "/images/social/cybernetix/Cybernetix-07.jpg",
        alt: "Cybernetix — social post 7",
        width: 645,
        height: 801,
      },
    ],
  },
  {
    id: "eternal-social",
    title: "Eternal — Social Content",
    clientId: "eternal",
    categoryIds: ["social-media", "marketing"],
    order: 2,
    images: [
      {
        src: "/images/social/eternal/eternal-01.jpg",
        alt: "Eternal — social post 1",
        width: 647,
        height: 806,
      },
      {
        src: "/images/social/eternal/eternal-02.jpg",
        alt: "Eternal — social post 2",
        width: 646,
        height: 802,
      },
      {
        src: "/images/social/eternal/eternal-03.jpg",
        alt: "Eternal — social post 3",
        width: 637,
        height: 792,
      },
      {
        src: "/images/social/eternal/eternal-04.jpg",
        alt: "Eternal — social post 4",
        width: 642,
        height: 802,
      },
      {
        src: "/images/social/eternal/eternal-05.jpg",
        alt: "Eternal — social post 5",
        width: 807,
        height: 802,
      },
      {
        src: "/images/social/eternal/eternal-06.jpeg",
        alt: "Eternal — social post 6",
        width: 1284,
        height: 1599,
      },
      {
        src: "/images/social/eternal/eternal-07.jpeg",
        alt: "Eternal — social post 7",
        width: 1284,
        height: 1597,
      },
    ],
  },
  {
    id: "friends-perk-cafe-social",
    title: "Friends Perk Cafe — Social Content",
    clientId: "friends-perk-cafe",
    categoryIds: ["social-media", "marketing"],
    order: 3,
    images: [
      {
        src: "/images/social/friends perk/friends-perk-cafe 01.jpeg",
        alt: "Friends Perk Cafe — social post 1",
        width: 1206,
        height: 1600,
      },
      {
        src: "/images/social/friends perk/friends-perk-cafe 02.jpeg",
        alt: "Friends Perk Cafe — social post 2",
        width: 1206,
        height: 1600,
      },
      {
        src: "/images/social/friends perk/friends-perk-cafe 03.jpeg",
        alt: "Friends Perk Cafe — social post 3",
        width: 1282,
        height: 1600,
      },
      {
        src: "/images/social/friends perk/friends-perk-cafe 04.jpeg",
        alt: "Friends Perk Cafe — social post 4",
        width: 1196,
        height: 1600,
      },
      {
        src: "/images/social/friends perk/friends-perk-cafe 05.jpeg",
        alt: "Friends Perk Cafe — social post 5",
        width: 960,
        height: 1280,
      },
    ],
  },
  {
    id: "pixelscape-social",
    title: "Pixelscape — Social Content",
    clientId: "pixelscape",
    categoryIds: ["social-media", "marketing"],
    order: 4,
    images: [
      {
        src: "/images/social/pixelscape/pixelscape-01.jpg",
        alt: "Pixelscape — social post 1",
        width: 1080,
        height: 1080,
      },
      {
        src: "/images/social/pixelscape/pixelscape-02.jpg",
        alt: "Pixelscape — social post 2",
        width: 928,
        height: 1152,
      },
      {
        src: "/images/social/pixelscape/pixelscape-03.jpg",
        alt: "Pixelscape — social post 3",
        width: 928,
        height: 1152,
      },
      {
        src: "/images/social/pixelscape/pixelscape-04.jpg",
        alt: "Pixelscape — social post 4",
        width: 928,
        height: 1152,
      },
      {
        src: "/images/social/pixelscape/pixelscape-05.jpg",
        alt: "Pixelscape — social post 5",
        width: 928,
        height: 1152,
      },
      {
        src: "/images/social/pixelscape/pixelscape-06.jpg",
        alt: "Pixelscape — social post 6",
        width: 928,
        height: 1152,
      },
      {
        src: "/images/social/pixelscape/pixelscape-07.jpg",
        alt: "Pixelscape — social post 7",
        width: 928,
        height: 1152,
      },
      {
        src: "/images/social/pixelscape/pixelscape-08.jpg",
        alt: "Pixelscape — social post 8",
        width: 928,
        height: 1152,
      },
      {
        src: "/images/social/pixelscape/pixelscape-09.jpg",
        alt: "Pixelscape — social post 9",
        width: 1080,
        height: 1080,
      },
      {
        src: "/images/social/pixelscape/Pixelscape-10.jpg",
        alt: "Pixelscape — social post 10",
        width: 928,
        height: 1152,
      },
      {
        src: "/images/social/pixelscape/Pixelscape-11.jpg",
        alt: "Pixelscape — social post 11",
        width: 928,
        height: 1152,
      },
      {
        src: "/images/social/pixelscape/Pixelscape-12.jpg",
        alt: "Pixelscape — social post 12",
        width: 928,
        height: 1152,
      },
      {
        src: "/images/social/pixelscape/Pixelscape-13.jpg",
        alt: "Pixelscape — social post 13",
        width: 928,
        height: 1152,
      },
      {
        src: "/images/social/pixelscape/Pixelscape-14.jpg",
        alt: "Pixelscape — social post 14",
        width: 928,
        height: 1152,
      },
      {
        src: "/images/social/pixelscape/Pixelscape-15.jpg",
        alt: "Pixelscape — social post 15",
        width: 928,
        height: 1152,
      },
    ],
  },
];

export function getSocialCampaignById(id: string): SocialCampaign | undefined {
  return socialCampaigns.find((campaign) => campaign.id === id);
}

export function getSocialCampaignsByClientId(
  clientId: ClientId
): SocialCampaign[] {
  return socialCampaigns.filter((campaign) => campaign.clientId === clientId);
}
