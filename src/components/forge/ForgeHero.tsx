import type { ReactNode } from "react"
import { CALENDLY } from "@/lib/links"

/** Sub-page hero (Brands / Agencies / Platforms): single-column, left-aligned. */
export function ForgeHero({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub: ReactNode }) {
  return (
    <header className="fg-hero">
      <div className="fg-aurora" style={{ width: 680, height: 480, left: "24%", top: "8%" }} />
      <div className="fg-wrap fg-hero-single">
        <p className="fg-eyebrow">{eyebrow}</p>
        <h1 className="fg-h1">{title}</h1>
        <p className="fg-sub">{sub}</p>
        <div className="fg-cta-row">
          <a className="fg-btn primary" href={CALENDLY} target="_blank" rel="noopener noreferrer">Chat with founder</a>
        </div>
      </div>
    </header>
  )
}
