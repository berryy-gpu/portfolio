import type { ReelVideoPath } from "./assets";
import type { CategoryId } from "./categories";
import type { ClientId } from "./clients";

export interface Reel {
  id: string;
  title: string;
  clientId: ClientId;
  categoryIds: CategoryId[];
  src: ReelVideoPath;
  order?: number;
}

export const reels: Reel[] = [
  {
    id: "eternal-vid-01",
    title: "Eternal — Reel 01",
    clientId: "eternal",
    categoryIds: ["video-editing", "social-media"],
    src: "/videos/reels/eternal-vid-01.mp4",
    order: 1,
  },
  {
    id: "eternal-vid-02",
    title: "Eternal — Reel 02",
    clientId: "eternal",
    categoryIds: ["video-editing", "social-media"],
    src: "/videos/reels/eternal-vid-02.mp4",
    order: 2,
  },
  {
    id: "friends-perk-cafe-vid-02",
    title: "Friends Perk Cafe — Reel 02",
    clientId: "friends-perk-cafe",
    categoryIds: ["video-editing", "social-media"],
    src: "/videos/reels/friends-perk-cafe-vid-02.mp4",
    order: 3,
  },
  {
    id: "friends-perk-cafe-vid-03",
    title: "Friends Perk Cafe — Reel 03",
    clientId: "friends-perk-cafe",
    categoryIds: ["video-editing", "social-media"],
    src: "/videos/reels/friends-perk-cafe-vid-03.mp4",
    order: 4,
  },
  {
    id: "friends-perk-cafe-vid-05",
    title: "Friends Perk Cafe — Reel 05",
    clientId: "friends-perk-cafe",
    categoryIds: ["video-editing", "social-media"],
    src: "/videos/reels/friends-perk-cafe-vid-05.mp4",
    order: 5,
  },
  {
    id: "friends-perk-cafe-vid-06",
    title: "Friends Perk Cafe — Reel 06",
    clientId: "friends-perk-cafe",
    categoryIds: ["video-editing", "social-media"],
    src: "/videos/reels/friends-perk-cafe-vid-06.mp4",
    order: 6,
  },
];

export function getReelById(id: string): Reel | undefined {
  return reels.find((reel) => reel.id === id);
}

export function getReelsByClientId(clientId: ClientId): Reel[] {
  return reels.filter((reel) => reel.clientId === clientId);
}
