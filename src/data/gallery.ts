import type { GalleryImagePath, SocialImagePath } from "./assets";
import { getClientById, type ClientId } from "./clients";
import { getReelsByClientId, type Reel } from "./reels";
import { getShowreelsByClientId, type Showreel } from "./showreels";
import { getSocialCampaignsByClientId, type SocialImage } from "./socialCampaigns";

/**
 * REBUILD-SPEC.md step 8 (+ later polish pass) — /gallery is the home for
 * social campaigns, reels/showreels, and Baran Haider's own content,
 * grouped BY SECTION rather than one mixed feed.
 *
 * Two kinds of group:
 *  - "client": derived from socialCampaigns.ts/reels.ts/showreels.ts,
 *    adds no new content.
 *  - "own": Baran Haider's own real-reach results carousel — his own
 *    content, not a client's, kept last and clearly labeled as such.
 *
 * Order is explicit (not derived from workOrder, which is website-first)
 * — the four real clients with social/motion assets, in the order named
 * in the spec, followed by the "own" group last.
 */
const GALLERY_CLIENT_ORDER: ClientId[] = [
  "pixelscape",
  "cybernetix",
  "eternal",
  "friends-perk-cafe",
];

export type GalleryGroupKind = "client" | "own";

interface GalleryImage {
  src: SocialImagePath | GalleryImagePath;
  alt: string;
  width: number;
  height: number;
}

export interface GalleryGroup {
  /** Used for the section anchor (`id="gallery-{id}"`) and the index nav. */
  id: string;
  name: string;
  kind: GalleryGroupKind;
  images: GalleryImage[];
  reels: Reel[];
  showreels: Showreel[];
  /** A real, derived one-line summary ("15 posts · 2 reels") — never
   *  hardcoded, and never invented when a group has no media of some
   *  particular kind (that part of the line is simply omitted). */
  countLine: string;
}

function buildCountLine(images: GalleryImage[], reels: Reel[], showreels: Showreel[]): string {
  const parts: string[] = [];

  if (images.length > 0) {
    parts.push(`${images.length} post${images.length === 1 ? "" : "s"}`);
  }
  if (reels.length > 0) {
    parts.push(`${reels.length} reel${reels.length === 1 ? "" : "s"}`);
  }
  if (showreels.length > 0) {
    parts.push(`${showreels.length} showreel${showreels.length === 1 ? "" : "s"}`);
  }

  return parts.join(" · ");
}

function getClientGroups(): GalleryGroup[] {
  return GALLERY_CLIENT_ORDER.map((clientId): GalleryGroup | undefined => {
    const client = getClientById(clientId);
    if (!client) return undefined;

    const images: SocialImage[] = getSocialCampaignsByClientId(clientId).flatMap(
      (campaign) => campaign.images
    );
    const reels = getReelsByClientId(clientId);
    const showreels = getShowreelsByClientId(clientId);

    if (images.length === 0 && reels.length === 0 && showreels.length === 0) {
      return undefined;
    }

    return {
      id: client.id,
      name: client.name,
      kind: "client",
      images,
      reels,
      showreels,
      countLine: buildCountLine(images, reels, showreels),
    };
  }).filter((group): group is GalleryGroup => Boolean(group));
}

/** Baran Haider's own real-reach results carousel (5 slides) — real
 *  intrinsic dimensions as supplied with the source files (1080x1350).
 *  Order preserved 1-5 (a real carousel sequence, read left to right) —
 *  never shuffled into masonry. Alt text stays factual (what the slide
 *  is and its position), not a claim about numbers not given here. */
const OWN_CONTENT_IMAGES: GalleryImage[] = [1, 2, 3, 4, 5].map((n) => ({
  src: `/images/gallery/baranhaider/real-reach-${n}.webp`,
  alt: `Baran Haider — 30-day reach results, slide ${n} of 5`,
  width: 1080,
  height: 1350,
}));

function getOwnContentGroup(): GalleryGroup | undefined {
  if (OWN_CONTENT_IMAGES.length === 0) return undefined;

  return {
    id: "baran-haider",
    name: "Baran Haider — Own Content",
    kind: "own",
    images: OWN_CONTENT_IMAGES,
    reels: [],
    showreels: [],
    countLine: buildCountLine(OWN_CONTENT_IMAGES, [], []),
  };
}

export function getGalleryGroups(): GalleryGroup[] {
  const ownGroup = getOwnContentGroup();
  return [...getClientGroups(), ...(ownGroup ? [ownGroup] : [])];
}

/** A real poster image for a client's reels/showreels — reels.ts and
 *  showreels.ts have no per-clip poster field, so this reuses the same
 *  "client's first real social image" derivation already established by
 *  getClientPreviewVideo (data/work.ts) rather than inventing a new
 *  poster asset or leaving <video> posterless. encodeURI is required
 *  here (unlike next/image, which encodes its own src) because this
 *  feeds a raw <video poster> attribute — public/images/social/
 *  "friends perk" has a literal space in its folder name. Only
 *  meaningful for "client" groups — the "own" group has no reels. */
export function getClientPosterImage(clientId: ClientId): string | undefined {
  const image = getSocialCampaignsByClientId(clientId).flatMap((campaign) => campaign.images)[0];
  return image ? encodeURI(image.src) : undefined;
}
