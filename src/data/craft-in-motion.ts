import { getReelById, type Reel } from "./reels";
import { getShowreelById, type Showreel } from "./showreels";

/**
 * Craft in Motion's own configuration — deliberately separate from
 * homepage.ts. homepage.ts owns homepage-level structure (section
 * ordering, which projects get featured); it shouldn't also own the
 * specifics of curating one section's media. Media curation is a
 * different kind of decision — which clips, in what order, with what
 * captions/posters — and it belongs to the section that consumes it.
 *
 * Any future Craft in Motion-specific configuration (captions, poster
 * images, per-clip display order, etc.) belongs in this file, not
 * homepage.ts.
 */

interface CraftInMotionRef {
  type: "reel" | "showreel";
  id: string;
}

/**
 * The curated selection. The Content Architecture flagged Friends Perk
 * Cafe as the most video-rich client (four reels, two showreels) and
 * recommended it get real weight here — this list follows that
 * reasoning: one Eternal reel plus two Friends Perk Cafe clips (one
 * reel, one showreel), covering both video clients and both formats.
 * This is a curation judgment, not a neutral fact — swap freely if a
 * different selection represents the work better.
 */
const craftInMotionSelection: CraftInMotionRef[] = [
  { type: "reel", id: "eternal-vid-01" },
  { type: "reel", id: "friends-perk-cafe-vid-02" },
  { type: "showreel", id: "friends-perk-cafe-vid-01" },
];

export function getCraftInMotionMedia(): (Reel | Showreel)[] {
  return craftInMotionSelection
    .map((ref) =>
      ref.type === "reel" ? getReelById(ref.id) : getShowreelById(ref.id)
    )
    .filter((item): item is Reel | Showreel => Boolean(item));
}
