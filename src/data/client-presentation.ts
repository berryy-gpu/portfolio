import type { ClientId } from "./clients";

/**
 * Presentation-only config for Client Story pages — editorial tone,
 * section order, and visual emphasis. This file (and client-atmosphere.ts
 * beside it) is the ONLY place that should ever describe HOW a client's
 * story is presented. Business data — which projects/campaigns/videos a
 * client actually has — stays entirely in projects.ts / socialCampaigns.ts
 * / reels.ts / showreels.ts. Components read from here rather than
 * hardcoding copy or ordering, so a new client (or a mood change for an
 * existing one) is a data edit here, not a component change.
 */

export type ClientSectionId = "website" | "social" | "motion" | "process";

export interface ClientSectionCopy {
  eyebrow: string;
  title: string;
  description?: string;
}

export type ClientSectionEmphasis = "standard" | "large";

const defaultSectionOrder: ClientSectionId[] = [
  "website",
  "social",
  "motion",
  "process",
];

const defaultSectionCopy: Record<ClientSectionId, ClientSectionCopy> = {
  website: { eyebrow: "The Website", title: "A closer look" },
  social: { eyebrow: "Social Content", title: "Published work" },
  motion: { eyebrow: "Motion", title: "Reels & showreels" },
  process: { eyebrow: "The Approach", title: "How this came together" },
};

interface ClientPresentationOverrides {
  sectionOrder?: ClientSectionId[];
  sectionCopy?: Partial<Record<ClientSectionId, Partial<ClientSectionCopy>>>;
  emphasis?: Partial<Record<ClientSectionId, ClientSectionEmphasis>>;
}

/**
 * Only real, deliberate differences go here — clients well served by the
 * defaults simply have no entry. Eternal leads with Motion (no website
 * project exists for them, and reels/showreels are their real strength,
 * not a fallback). Hi-Hat's website gets "large" emphasis for the
 * cinematic, film-inspired direction called out for them specifically.
 */
const overrides: Partial<Record<ClientId, ClientPresentationOverrides>> = {
  hihat: {
    emphasis: { website: "large" },
    sectionCopy: {
      website: { title: "A cinematic first look" },
    },
  },
  aureate: {
    sectionCopy: {
      website: { eyebrow: "The Craft", title: "Considered, in every detail" },
    },
  },
  "friends-perk-cafe": {
    sectionCopy: {
      social: { eyebrow: "The Feed", title: "A warm, everyday presence" },
    },
  },
  eternal: {
    sectionOrder: ["motion", "social", "process"],
    sectionCopy: {
      motion: { eyebrow: "The Films", title: "Moments, captured" },
    },
  },
};

export function getClientSectionOrder(clientId: ClientId): ClientSectionId[] {
  return overrides[clientId]?.sectionOrder ?? defaultSectionOrder;
}

export function getClientSectionCopy(
  clientId: ClientId,
  section: ClientSectionId
): ClientSectionCopy {
  return {
    ...defaultSectionCopy[section],
    ...overrides[clientId]?.sectionCopy?.[section],
  };
}

export function getClientSectionEmphasis(
  clientId: ClientId,
  section: ClientSectionId
): ClientSectionEmphasis {
  return overrides[clientId]?.emphasis?.[section] ?? "standard";
}
