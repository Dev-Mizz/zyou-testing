import type { ComponentType } from "react"
import {
  SiStripe, SiUnity, SiTiktok, SiHubspot, SiShopify, SiSemrush,
} from "react-icons/si"
import { FaSalesforce } from "react-icons/fa"
import { TbBrandTwilio } from "react-icons/tb"

type Brand = { Icon: ComponentType<{ size?: number; color?: string }>; color: string }

/* Simple Icons — only for brands that are genuinely single-colour marks (or that
   need recolouring on dark, e.g. tiktok). Multicolour brands render from their
   real asset below instead, so they don't flatten to one tint. */
const BRANDS: Record<string, Brand> = {
  stripe: { Icon: SiStripe, color: "#635BFF" },
  twilio: { Icon: TbBrandTwilio, color: "#F22F46" },
  unity: { Icon: SiUnity, color: "#FFFFFF" },
  salesforce: { Icon: FaSalesforce, color: "#00A1E0" },
  tiktok: { Icon: SiTiktok, color: "#000000" },
  hubspot: { Icon: SiHubspot, color: "#FF7A59" },
  shopify: { Icon: SiShopify, color: "#7AB55C" },
  semrush: { Icon: SiSemrush, color: "#FF642D" },
}

/* Original full-colour asset images. Multicolour brand logos (Google Ads,
   Gmail, Meta, the Google analytics/sheets marks) live here so they render in
   true brand colour rather than a flat Simple Icons tint. */
const IMG: Record<string, string> = {
  meta: "meta.svg",
  "google-ads": "google-ads.svg",
  gmail: "gmail.svg",
  "google-analytics": "google-analytics.svg",
  ga4: "google-analytics.svg",
  "google-sheets": "google-sheets.svg",
  sheets: "google-sheets.svg",
  slack: "slack.svg",
  amazon: "amazon.svg",
  dv360: "dv360.svg",
  ttd: "ttd.png",
  appsflyer: "appsflyer.svg",
  langchain: "langchain-mark.png",
}

export function BrandLogo({ name, size = 24, color }: { name: string; size?: number; color?: string }) {
  const b = BRANDS[name]
  if (b) {
    const C = b.Icon
    return <C size={size} color={color ?? b.color} />
  }
  const file = IMG[name]
  if (file) {
    return (
      <img
        src={`/logos/brands/${file}`}
        alt=""
        style={{ height: size, width: "auto", display: "block", objectFit: "contain", flex: "0 0 auto" }}
      />
    )
  }
  return null // ponytail: unknown brand renders nothing, matching the ref's onError-hide
}
