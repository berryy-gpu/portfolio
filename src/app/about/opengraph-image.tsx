import {
  ogImageContentType,
  ogImageSize,
  renderOgImage,
} from "@/lib/og-image";

import { aboutDescription } from "./page-meta";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "About";

export default function Image() {
  return renderOgImage({ title: "About", subtitle: aboutDescription });
}
