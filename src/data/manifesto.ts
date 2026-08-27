export interface ManifestoContent {
  statement: string;
}

/**
 * The homepage Statement section's copy — real, user-supplied text, kept
 * verbatim. Previously aliased aboutContent.philosophy, which is itself
 * invented filler never actually supplied (see about.ts — flagged
 * separately, not touched here since this step only covers the Statement
 * section). This string is its own thing now, not shared with About.
 */
export const manifesto: ManifestoContent = {
  statement:
    "I don't just build websites. I build things people want to use, content people want to watch, and systems that make a business easier to discover, understand, and trust.",
};
