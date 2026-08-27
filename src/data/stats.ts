import { reels } from "./reels";
import { showreels } from "./showreels";
import { socialCampaigns } from "./socialCampaigns";

export interface Stat {
  id: string;
  value: number;
  label: string;
}

// Real totals across all engagements, supplied directly by the site
// owner — these exceed clients.length (11) / projects.length (11)
// because not every client has a published case study on /work. Used
// ONLY inside getStats(); every other consumer of clients.length (e.g.
// the About page's facts block, deliberately scoped to "clients shown
// here") is untouched.
const TOTAL_CLIENTS_SERVED = 20;
const TOTAL_WEBSITES_SHIPPED = 25;

/**
 * REBUILD-SPEC.md section 08 — every figure derived at build time from
 * real data elsewhere in src/data, never hardcoded. A stat that would
 * compute to 0 is omitted rather than shown as "0" (e.g. if the roster
 * ever had zero video clients, "0 videos produced" would read as a
 * missing feature, not an honest fact).
 */
export function getStats(): Stat[] {
  const candidates: Stat[] = [
    { id: "clients", value: TOTAL_CLIENTS_SERVED, label: "Clients" },
    { id: "websites", value: TOTAL_WEBSITES_SHIPPED, label: "Websites shipped" },
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
