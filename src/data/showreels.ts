import type { ShowreelVideoPath } from "./assets";
import type { CategoryId } from "./categories";
import type { ClientId } from "./clients";

export interface Showreel {
  id: string;
  title: string;
  clientId: ClientId;
  categoryIds: CategoryId[];
  src: ShowreelVideoPath;
  order?: number;
}

export const showreels: Showreel[] = [
  {
    id: "eternal-vid-03",
    title: "Eternal — Showreel 03",
    clientId: "eternal",
    categoryIds: ["video-production"],
    src: "/videos/showreel/eternal-vid-03.mp4",
    order: 1,
  },
  {
    id: "eternal-vid-04",
    title: "Eternal — Showreel 04",
    clientId: "eternal",
    categoryIds: ["video-production"],
    src: "/videos/showreel/eternal-vid-04.mp4",
    order: 2,
  },
  {
    id: "friends-perk-cafe-vid-01",
    title: "Friends Perk Cafe — Showreel 01",
    clientId: "friends-perk-cafe",
    categoryIds: ["video-production"],
    src: "/videos/showreel/friends-perk-cafe-vid-01.mp4",
    order: 3,
  },
  {
    id: "friends-perk-cafe-vid-04",
    title: "Friends Perk Cafe — Showreel 04",
    clientId: "friends-perk-cafe",
    categoryIds: ["video-production"],
    src: "/videos/showreel/friends-perk-cafe-vid-04.mp4",
    order: 4,
  },
];

export function getShowreelById(id: string): Showreel | undefined {
  return showreels.find((showreel) => showreel.id === id);
}

export function getShowreelsByClientId(clientId: ClientId): Showreel[] {
  return showreels.filter((showreel) => showreel.clientId === clientId);
}
