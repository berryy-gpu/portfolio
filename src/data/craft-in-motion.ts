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
 * The curated selection — six of the ten available reel/showreel assets,
 * split evenly 3/3 between clients and 3/3 between reel/showreel formats:
 * two Eternal reels + one Eternal showreel, one Friends Perk Cafe reel +
 * two Friends Perk Cafe showreels. Friends Perk Cafe still gets slightly
 * more of its showreel (production) side represented, consistent with
 * the Content Architecture's note that it's the most video-rich client.
 * This is a curation judgment, not a neutral fact — swap freely if a
 * different selection represents the work better.
 */
const craftInMotionSelection: CraftInMotionRef[] = [
  { type: "reel", id: "eternal-vid-01" },
  { type: "reel", id: "eternal-vid-02" },
  { type: "showreel", id: "eternal-vid-03" },
  { type: "reel", id: "friends-perk-cafe-vid-02" },
  { type: "showreel", id: "friends-perk-cafe-vid-01" },
  { type: "showreel", id: "friends-perk-cafe-vid-04" },
];

export function getCraftInMotionMedia(): (Reel | Showreel)[] {
  return craftInMotionSelection
    .map((ref) =>
      ref.type === "reel" ? getReelById(ref.id) : getShowreelById(ref.id)
    )
    .filter((item): item is Reel | Showreel => Boolean(item));
}
