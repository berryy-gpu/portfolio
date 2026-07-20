import { siteConfig } from "@/data/site";
import {
  ogImageContentType,
  ogImageSize,
  renderOgImage,
} from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = siteConfig.name;

export default function Image() {
  return renderOgImage({ title: siteConfig.name, subtitle: siteConfig.tagline });
}
