import { LOGO_COLOR_DIR, LOGO_MONO_DIR, type LogoImagePath } from "./assets";

export const CLIENT_IDS = [
  "aureate",
  "clix",
  "cybernetix",
  "hihat",
  "pixelscape",
  "eternal",
  "friends-perk-cafe",
  "ay-architects",
  "zoe-ministries",
  "azura",
  "thompson",
] as const;

export type ClientId = (typeof CLIENT_IDS)[number];

export interface Client {
  id: ClientId;
  name: string;
  industry?: string;
  website?: string;
  /** Monochrome white logo on transparency. */
  logo?: LogoImagePath;
  /** Real locations only — omitted where genuinely unknown. */
  location?: string;
}

export const clients: Client[] = [
  {
    id: "cybernetix",
    name: "Cybernetix",
    industry: "Cybersecurity",
    website: "https://cybernetix.ae",
    logo: "/images/logos/mono/cybernetix.png",
    location: "UAE",
  },
  {
    id: "pixelscape",
    name: "Pixelscape",
    industry: "Creative Studio",
    website: "https://pixelscape.com.pk",
    logo: "/images/logos/mono/pixelscape.png",
    location: "Pakistan",
  },
  {
    id: "aureate",
    name: "Aureate 161",
    industry: "Real Estate",
    website: "https://aureate161.com",
    logo: "/images/logos/mono/aureate.png",
    // location genuinely unknown — omitted, not guessed.
  },
  {
    id: "clix",
    name: "Clix-CRM",
    industry: "SaaS / CRM",
    website: "https://clix-crm.com",
    logo: "/images/logos/mono/clix.png",
    location: "UAE",
  },
  {
    id: "hihat",
    name: "Hi-Hat Productions",
    industry: "Video Production",
    website: "https://hi-hatproductions.com",
    logo: "/images/logos/mono/hihat.png",
    // location genuinely unknown — omitted, not guessed.
  },
  {
    id: "ay-architects",
    name: "AY Architects",
    industry: "Architecture & Interiors",
    website: "https://www.ayarchitects.site",
    location: "Lahore, Pakistan",
  },
  {
    id: "zoe-ministries",
    name: "Zoe Ministries",
    industry: "Ministry / Nonprofit",
    website: "https://zoeministries.com",
    location: "New York, USA",
  },
  {
    id: "azura",
    name: "Azura Building Group",
    industry: "Residential Construction",
    website: "https://azurabuildinggroup.com.au",
    location: "Queensland, Australia",
  },
  {
    id: "thompson",
    name: "Thompson Sustainable Homes",
    industry: "Sustainable Home Building",
    website: "https://www.thompsonsustainablehomes.com.au",
    location: "Sunshine Coast, Australia",
  },
  {
    id: "eternal",
    name: "Eternal VIP Concierge",
    industry: "Luxury Concierge",
    logo: "/images/logos/mono/eternal.png",
    // no website — video-only client.
  },
  {
    id: "friends-perk-cafe",
    name: "Friends Perk Cafe",
    industry: "Hospitality",
    // no website, no logo — video/social-only client.
  },
];

export function getClientById(id: ClientId): Client | undefined {
  return clients.find((client) => client.id === id);
}

/** Every distinct real industry represented across real clients
 *  (REBUILD-SPEC.md 4b's homepage Industries section), in first-occurrence
 *  order — derived from Client.industry, never a separately maintained
 *  list that could drift out of sync with who the clients actually are. */
export function getDistinctIndustries(): string[] {
  const industries = clients
    .map((client) => client.industry)
    .filter((industry): industry is string => Boolean(industry));
  return Array.from(new Set(industries));
}

/** Clients with no real logo asset in public/images/logos — the Client
 *  Marquee (and anywhere else a logo is shown) falls back to a text
 *  wordmark for these rather than inventing artwork. Kept in sync with
 *  each client's own `logo` field above (used by getClientLogoPath's
 *  colour-variant lookup, which client.logo itself doesn't cover). */
const CLIENTS_WITHOUT_LOGOS: ReadonlySet<ClientId> = new Set([
  "friends-perk-cafe",
  "ay-architects",
  "zoe-ministries",
  "azura",
  "thompson",
]);

/**
 * A client's real logo file, if one exists — public/images/logos/{color,
 * mono}/<clientId>.png. Returns undefined for clients with none (see
 * CLIENTS_WITHOUT_LOGOS) so callers render their real name as a wordmark
 * instead, per the "never invent content" rule. Prefer `client.logo`
 * directly when only the mono variant is needed; this stays for the
 * colour-variant consumers (ClientHero, Testimonials).
 */
export function getClientLogoPath(
  clientId: ClientId,
  variant: "color" | "mono" = "color"
): LogoImagePath | undefined {
  if (CLIENTS_WITHOUT_LOGOS.has(clientId)) return undefined;
  const dir = variant === "color" ? LOGO_COLOR_DIR : LOGO_MONO_DIR;
  return `${dir}/${clientId}.png`;
}

/** Real intrinsic pixel dimensions, read from the actual logo files (color
 *  and mono share dimensions per client) — same convention as SocialImage,
 *  so next/image can size a logo correctly without layout shift. */
const CLIENT_LOGO_DIMENSIONS: Partial<Record<ClientId, { width: number; height: number }>> = {
  aureate: { width: 191, height: 240 },
  clix: { width: 223, height: 240 },
  cybernetix: { width: 330, height: 240 },
  hihat: { width: 560, height: 176 },
  pixelscape: { width: 317, height: 75 },
  eternal: { width: 223, height: 240 },
};

export function getClientLogoDimensions(
  clientId: ClientId
): { width: number; height: number } | undefined {
  return CLIENT_LOGO_DIMENSIONS[clientId];
}
