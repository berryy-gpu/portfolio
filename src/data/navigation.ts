export interface NavItem {
  label: string;
  href: string;
}

/**
 * Primary navigation. "Home" is not listed here — the logo/site name
 * serves as the home link. "Reels" is not a standalone item — it's
 * absorbed into /work's category filters. Both per the approved
 * Master Design Specification §5.
 */
export const mainNav: NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

/**
 * Contact is treated as a persistent CTA button, not a plain nav link —
 * kept separate from mainNav so components don't have to special-case it.
 */
export const contactCta: NavItem = { label: "Contact", href: "/contact" };
