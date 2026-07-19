import type { SocialImagePath } from "./assets";
import type { CategoryId } from "./categories";
import type { ClientId } from "./clients";

export interface SocialImage {
  src: SocialImagePath;
  alt: string;
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
      },
      {
        src: "/images/social/cybernetix/cybernetix-02.jpg",
        alt: "Cybernetix — social post 2",
      },
      {
        src: "/images/social/cybernetix/Cybernetix-03.jpg",
        alt: "Cybernetix — social post 3",
      },
      {
        src: "/images/social/cybernetix/Cybernetix-04.jpg",
        alt: "Cybernetix — social post 4",
      },
      {
        src: "/images/social/cybernetix/Cybernetix-05.jpg",
        alt: "Cybernetix — social post 5",
      },
      {
        src: "/images/social/cybernetix/Cybernetix-06.jpg",
        alt: "Cybernetix — social post 6",
      },
      {
        src: "/images/social/cybernetix/Cybernetix-07.jpg",
        alt: "Cybernetix — social post 7",
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
      { src: "/images/social/eternal/eternal-01.jpg", alt: "Eternal — social post 1" },
      { src: "/images/social/eternal/eternal-02.jpg", alt: "Eternal — social post 2" },
      { src: "/images/social/eternal/eternal-03.jpg", alt: "Eternal — social post 3" },
      { src: "/images/social/eternal/eternal-04.jpg", alt: "Eternal — social post 4" },
      { src: "/images/social/eternal/eternal-05.jpg", alt: "Eternal — social post 5" },
      { src: "/images/social/eternal/eternal-06.jpeg", alt: "Eternal — social post 6" },
      { src: "/images/social/eternal/eternal-07.jpeg", alt: "Eternal — social post 7" },
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
      },
      {
        src: "/images/social/friends perk/friends-perk-cafe 02.jpeg",
        alt: "Friends Perk Cafe — social post 2",
      },
      {
        src: "/images/social/friends perk/friends-perk-cafe 03.jpeg",
        alt: "Friends Perk Cafe — social post 3",
      },
      {
        src: "/images/social/friends perk/friends-perk-cafe 04.jpeg",
        alt: "Friends Perk Cafe — social post 4",
      },
      {
        src: "/images/social/friends perk/friends-perk-cafe 05.jpeg",
        alt: "Friends Perk Cafe — social post 5",
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
      { src: "/images/social/pixelscape/pixelscape-01.jpg", alt: "Pixelscape — social post 1" },
      { src: "/images/social/pixelscape/pixelscape-02.jpg", alt: "Pixelscape — social post 2" },
      { src: "/images/social/pixelscape/pixelscape-03.jpg", alt: "Pixelscape — social post 3" },
      { src: "/images/social/pixelscape/pixelscape-04.jpg", alt: "Pixelscape — social post 4" },
      { src: "/images/social/pixelscape/pixelscape-05.jpg", alt: "Pixelscape — social post 5" },
      { src: "/images/social/pixelscape/pixelscape-06.jpg", alt: "Pixelscape — social post 6" },
      { src: "/images/social/pixelscape/pixelscape-07.jpg", alt: "Pixelscape — social post 7" },
      { src: "/images/social/pixelscape/pixelscape-08.jpg", alt: "Pixelscape — social post 8" },
      { src: "/images/social/pixelscape/pixelscape-09.jpg", alt: "Pixelscape — social post 9" },
      { src: "/images/social/pixelscape/Pixelscape-10.jpg", alt: "Pixelscape — social post 10" },
      { src: "/images/social/pixelscape/Pixelscape-11.jpg", alt: "Pixelscape — social post 11" },
      { src: "/images/social/pixelscape/Pixelscape-12.jpg", alt: "Pixelscape — social post 12" },
      { src: "/images/social/pixelscape/Pixelscape-13.jpg", alt: "Pixelscape — social post 13" },
      { src: "/images/social/pixelscape/Pixelscape-14.jpg", alt: "Pixelscape — social post 14" },
      { src: "/images/social/pixelscape/Pixelscape-15.jpg", alt: "Pixelscape — social post 15" },
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
