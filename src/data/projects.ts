import type { ProjectImagePath } from "./assets";
import type { CategoryId } from "./categories";
import type { ClientId } from "./clients";

export interface ProjectImage {
  src: ProjectImagePath;
  alt: string;
  /** Short editorial caption for /work/[clientId] (image-caption.tsx).
   *  Left undefined rather than invented — see REBUILD-AUDIT.md for the
   *  list of images still needing a real one. */
  caption?: string;
}

export interface WebsitePreviewImage {
  src: ProjectImagePath;
  alt: string;
  /** Real intrinsic pixel dimensions — required by next/image and used to
   *  size the scrolling preview without distorting the screenshot. */
  width: number;
  height: number;
}

export type WebsitePreviewType = "full-page" | "dashboard" | "mobile" | "application";

export interface WebsitePreview {
  image: WebsitePreviewImage;
  domain: string;
  type: WebsitePreviewType;
}

export interface Project {
  id: string;
  title: string;
  clientId: ClientId;
  categoryIds: CategoryId[];
  summary?: string;
  images: ProjectImage[];
  /** The full-page homepage screenshot + real domain, used by Featured
   *  Work's AnimatedWebsitePreview. Optional so a project without a real
   *  domain/full-page capture yet doesn't need a placeholder. */
  websitePreview?: WebsitePreview;
  order?: number;
  /**
   * "build" = designed and developed from scratch.
   * "care"  = ongoing development on a site built by someone else.
   * These are DIFFERENT SERVICES and must never be presented as the same.
   */
  engagement: "build" | "care";
}

export const projects: Project[] = [
  {
    id: "ay-architects",
    title: "AY Architects",
    clientId: "ay-architects",
    categoryIds: ["website", "web-development", "ui-ux"],
    order: 0,
    engagement: "build",
    summary:
      "An editorial site for a Lahore architecture and interior studio — full-bleed aerial video hero, project galleries, and an ambient sound toggle.",
    websitePreview: {
      image: {
        src: "/images/projects/ayarchitects-homepage-preview.png",
        alt: "AY Architects — full homepage",
        width: 1102,
        height: 7800,
      },
      domain: "ayarchitects.site",
      type: "full-page",
    },
    images: [
      { src: "/images/projects/ayarchitects-homepage.png", alt: "AY Architects — homepage" },
      { src: "/images/projects/ayarchitects-aboutus.png", alt: "AY Architects — about" },
      { src: "/images/projects/ayarchitects-services.png", alt: "AY Architects — services" },
      // A fourth "projects" gallery screenshot exists but the only file on
      // disk is "ayarchitects-projects page.png" — a literal space in the
      // filename. Deliberately not referenced here; flagged separately
      // rather than guessed at or silently renamed.
    ],
  },
  {
    id: "cybernetix",
    title: "Cybernetix",
    clientId: "cybernetix",
    categoryIds: ["website", "web-development"],
    order: 1,
    engagement: "build",
    websitePreview: {
      image: {
        src: "/images/projects/cybernetix-homepage.png",
        alt: "Cybernetix — full homepage",
        width: 1896,
        height: 8612,
      },
      domain: "cybernetix.ae",
      type: "full-page",
    },
    images: [
      {
        src: "/images/projects/cybernetix-homepage.png",
        alt: "Cybernetix — homepage",
      },
      {
        src: "/images/projects/cybernetix-aboutus.png",
        alt: "Cybernetix — about us",
      },
      {
        src: "/images/projects/cybernetix-services.png",
        alt: "Cybernetix — services",
      },
    ],
  },
  {
    id: "pixelscape",
    title: "Pixelscape",
    clientId: "pixelscape",
    categoryIds: ["website", "web-development"],
    order: 2,
    engagement: "build",
    websitePreview: {
      image: {
        src: "/images/projects/pixelscape-homepage.png",
        alt: "Pixelscape — full homepage",
        width: 1918,
        height: 6701,
      },
      domain: "pixelscape.com.pk",
      type: "full-page",
    },
    images: [
      {
        src: "/images/projects/pixelscape-homepage.png",
        alt: "Pixelscape — homepage",
      },
    ],
  },
  {
    id: "aureate",
    title: "Aureate",
    clientId: "aureate",
    categoryIds: ["website", "web-development"],
    order: 3,
    engagement: "build",
    websitePreview: {
      image: {
        src: "/images/projects/aureate-01.png",
        alt: "Aureate 161 — full homepage",
        width: 1918,
        height: 7210,
      },
      domain: "aureate161.com",
      type: "full-page",
    },
    images: [
      { src: "/images/projects/aureate-01.png", alt: "Aureate — screen 1" },
      { src: "/images/projects/aureate-02.png", alt: "Aureate — screen 2" },
      { src: "/images/projects/aureate-03.png", alt: "Aureate — screen 3" },
      { src: "/images/projects/aureate-04.png", alt: "Aureate — screen 4" },
      { src: "/images/projects/aureate-05.png", alt: "Aureate — screen 5" },
      { src: "/images/projects/aureate-06.png", alt: "Aureate — screen 6" },
    ],
  },
  {
    id: "clix",
    title: "Clix",
    clientId: "clix",
    categoryIds: ["website", "web-development"],
    order: 4,
    engagement: "build",
    websitePreview: {
      image: {
        src: "/images/projects/clix-homepage.png",
        alt: "Clix — full homepage",
        width: 1918,
        height: 8856,
      },
      domain: "clix-crm.com",
      type: "full-page",
    },
    images: [
      { src: "/images/projects/clix-homepage.png", alt: "Clix — homepage" },
      {
        src: "/images/projects/clix-featurepage.png",
        alt: "Clix — feature page",
      },
    ],
  },
  {
    id: "hihat",
    title: "Hihat",
    clientId: "hihat",
    categoryIds: ["website", "web-development"],
    order: 5,
    engagement: "build",
    websitePreview: {
      image: {
        src: "/images/projects/hihat-homepage.png",
        alt: "Hi-Hat Productions — full homepage",
        width: 1916,
        height: 8728,
      },
      domain: "hi-hatproductions.com",
      type: "full-page",
    },
    images: [
      { src: "/images/projects/hihat-homepage.png", alt: "Hihat — homepage" },
      { src: "/images/projects/hihat-aboutus.png", alt: "Hihat — about us" },
    ],
  },
  {
    id: "zoe-ministries",
    title: "Zoe Ministries",
    clientId: "zoe-ministries",
    categoryIds: ["website", "web-care"],
    order: 6,
    engagement: "care",
    summary:
      "Ongoing development across a three-site network for a New York ministry — the organisation site plus the personal sites for Bishop E. Bernard Jordan and Pastor Debra Jordan.",
    images: [],
  },
  {
    id: "bishop-jordan",
    title: "Bishop E. Bernard Jordan",
    clientId: "zoe-ministries",
    categoryIds: ["website", "web-care"],
    order: 7,
    engagement: "care",
    images: [],
  },
  {
    id: "pastor-debra-jordan",
    title: "Pastor Debra Jordan",
    clientId: "zoe-ministries",
    categoryIds: ["website", "web-care"],
    order: 8,
    engagement: "care",
    images: [],
  },
  {
    id: "azura",
    title: "Azura Building Group",
    clientId: "azura",
    categoryIds: ["website", "web-care"],
    order: 9,
    engagement: "care",
    summary:
      "Ongoing development on a Queensland home builder's site — page updates, new pages, and design changes across home-and-land, residential, and commercial sections.",
    images: [],
  },
  {
    id: "thompson",
    title: "Thompson Sustainable Homes",
    clientId: "thompson",
    categoryIds: ["website", "web-care"],
    order: 10,
    engagement: "care",
    summary:
      "Ongoing development on a Sunshine Coast sustainable home builder's site — content updates, new pages, and design changes.",
    images: [],
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectsByClientId(clientId: ClientId): Project[] {
  return projects.filter((project) => project.clientId === clientId);
}

/** Human-readable label per engagement type — the ONE place this wording
 *  lives, so every consumer (client rows, hero, sidebar) says the same
 *  thing. "build" always wins if a client somehow has both (none do yet). */
export const ENGAGEMENT_LABELS: Record<Project["engagement"], string> = {
  build: "Website Build",
  care: "Website Care",
};

/** A client's overall engagement classification, derived from their real
 *  projects — undefined for clients with no website project at all
 *  (video/social-only clients like eternal, friends-perk-cafe). */
export function getClientEngagement(clientId: ClientId): Project["engagement"] | undefined {
  const clientProjects = getProjectsByClientId(clientId);
  if (clientProjects.some((project) => project.engagement === "build")) return "build";
  if (clientProjects.some((project) => project.engagement === "care")) return "care";
  return undefined;
}
