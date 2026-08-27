export interface NavItem {
  label: string;
  href: string;
}

/**
 * Primary navigation. "Home" is not listed here — the logo/site name
 * serves as the home link. "Gallery" (REBUILD-SPEC.md step 8) holds the
 * social campaigns and reels that used to live on /work — that page is
 * websites only now.
 */
export const mainNav: NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Gallery", href: "/gallery" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

/**
 * Contact is treated as a persistent CTA button, not a plain nav link —
 * kept separate from mainNav so components don't have to special-case it.
 */
export const contactCta: NavItem = { label: "Contact", href: "/contact" };
