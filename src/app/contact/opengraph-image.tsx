import {
  ogImageContentType,
  ogImageSize,
  renderOgImage,
} from "@/lib/og-image";

import { contactDescription } from "./page-meta";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Contact";

export default function Image() {
  return renderOgImage({ title: "Contact", subtitle: contactDescription });
}
