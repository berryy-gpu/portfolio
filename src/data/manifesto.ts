import { aboutContent } from "./about";

export interface ManifestoContent {
  statement: string;
}

/**
 * The homepage Statement section's copy. Reuses aboutContent.philosophy —
 * the site's one existing real statement of values/approach, already
 * written and approved for the About page — rather than inventing new
 * marketing copy for this placement. Sharing the string (not duplicating
 * it) means an edit only ever has to happen in one place.
 */
export const manifesto: ManifestoContent = {
  statement: aboutContent.philosophy,
};
