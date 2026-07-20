import { ImageResponse } from "next/og";

import { siteConfig } from "@/data/site";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

const BACKGROUND = "#0b0b0a";
const TEXT_PRIMARY = "#f5f3ee";
const TEXT_SECONDARY = "#a8a59d";
const DEFAULT_ACCENT = "#a64f39";

interface OgImageProps {
  title: string;
  subtitle?: string;
  accent?: string;
}

/** Shared Open Graph card renderer — real site name/title/subtitle only,
 *  no per-page screenshots (none are guaranteed to exist), styled with
 *  the same dark/accent-bar language as the rest of the site. */
export function renderOgImage({
  title,
  subtitle,
  accent = DEFAULT_ACCENT,
}: OgImageProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: BACKGROUND,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 56,
            height: 6,
            borderRadius: 3,
            backgroundColor: accent,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 600,
              color: TEXT_PRIMARY,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                color: TEXT_SECONDARY,
                maxWidth: 900,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {title !== siteConfig.name && (
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: TEXT_SECONDARY,
            }}
          >
            {siteConfig.name}
          </div>
        )}
      </div>
    ),
    { ...ogImageSize }
  );
}
