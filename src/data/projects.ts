import type { ProjectImagePath } from "./assets";
import type { CategoryId } from "./categories";
import type { ClientId } from "./clients";

export interface ProjectImage {
  src: ProjectImagePath;
  alt: string;
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
}

export const projects: Project[] = [
  {
    id: "aureate",
    title: "Aureate",
    clientId: "aureate",
    categoryIds: ["website", "web-development"],
    order: 3,
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
    id: "cybernetix",
    title: "Cybernetix",
    clientId: "cybernetix",
    categoryIds: ["website", "web-development"],
    order: 1,
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
    id: "hihat",
    title: "Hihat",
    clientId: "hihat",
    categoryIds: ["website", "web-development"],
    order: 5,
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
    id: "pixelscape",
    title: "Pixelscape",
    clientId: "pixelscape",
    categoryIds: ["website", "web-development"],
    order: 2,
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
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectsByClientId(clientId: ClientId): Project[] {
  return projects.filter((project) => project.clientId === clientId);
}
