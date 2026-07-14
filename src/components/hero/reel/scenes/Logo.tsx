import type { CSSProperties } from "react"

/* Official multicolor brand logos served from public/logos/brands/.
   Real brand SVGs (not monochrome glyphs) so colors match the marks exactly —
   e.g. the tricolor Google Ads "A". TikTok uses the white-note dark-bg variant.
   `objectFit: contain` keeps each logo's aspect ratio inside a square box. */
const FILES: Record<string, string> = {
  meta: "meta.svg",
  "google-ads": "google-ads.svg",
  google: "google-ads.svg",
  ga4: "google-analytics.svg",
  analytics: "google-analytics.svg",
  sheets: "google-sheets.svg",
  gmail: "gmail.svg",
  tiktok: "tiktok.svg",
  claude: "claude.svg",
}

export function Logo({ name, size = 18, style = {} }: { name: string; size?: number; style?: CSSProperties }) {
  const file = FILES[name]
  if (!file) return null
  return (
    <img
      src={`/logos/brands/${file}`}
      alt=""
      width={size}
      height={size}
      style={{ display: "block", objectFit: "contain", flex: "0 0 auto", ...style }}
    />
  )
}
