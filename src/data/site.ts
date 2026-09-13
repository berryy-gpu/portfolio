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
  location: "Lahore, PK",
  avatar: "/images/profile/me.webp",
  socialLinks: [
    { label: "Instagram", url: "https://www.instagram.com/baranhaider.dev/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/baran-haider-288326353" },
    { label: "WhatsApp", url: "https://wa.me/923148662368" },
  ],
};
