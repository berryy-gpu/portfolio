import type { ProfileImagePath } from "./assets";

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteConfig {
  name: string;
  role?: string;
  tagline?: string;
  description?: string;
  email?: string;
  location?: string;
  avatar: ProfileImagePath;
  socialLinks: SocialLink[];
}

export const siteConfig: SiteConfig = {
  name: "Baran Haider",
  tagline: "I build what ambitious brands grow on.",
  email: "m.baranhaider2018@gmail.com",
  avatar: "/images/profile/me.png",
  socialLinks: [],
};
