import { clients } from "./clients";
import { projects } from "./projects";
import { reels } from "./reels";
import { showreels } from "./showreels";
import { socialCampaigns } from "./socialCampaigns";

export interface Stat {
  id: string;
  value: number;
  label: string;
}

/**
 * REBUILD-SPEC.md section 08 — every figure derived at build time from
 * real data elsewhere in src/data, never hardcoded. A stat that would
 * compute to 0 is omitted rather than shown as "0" (e.g. if the roster
 * ever had zero video clients, "0 videos produced" would read as a
 * missing feature, not an honest fact).
 */
export function getStats(): Stat[] {
  const candidates: Stat[] = [
    { id: "clients", value: clients.length, label: "Clients" },
    { id: "websites", value: projects.length, label: "Websites shipped" },
    {
      id: "social-posts",
      value: socialCampaigns.flatMap((campaign) => campaign.images).length,
      label: "Social posts published",
    },
    {
      id: "videos",
      value: reels.length + showreels.length,
      label: "Videos produced",
    },
  ];

  return candidates.filter((stat) => stat.value > 0);
}
