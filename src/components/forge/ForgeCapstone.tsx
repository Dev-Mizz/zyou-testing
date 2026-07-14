import type { CSSProperties, ReactNode } from "react"
import { CALENDLY } from "@/lib/links"

/** Shared closing CTA. */
export function ForgeCapstone({ children, headStyle }: { children: ReactNode; headStyle?: CSSProperties }) {
  return (
    <section className="fg-capstone">
      <div className="fg-aurora" style={{ width: 600, height: 420, left: "50%", top: "40%", transform: "translateX(-50%)" }} />
      <div className="fg-wrap">
        <h2 className="fg-h2 wide" style={headStyle}>{children}</h2>
        <div className="fg-cta-row">
          <a className="fg-btn primary" href={CALENDLY} target="_blank" rel="noopener noreferrer">Chat with founder</a>
        </div>
      </div>
    </section>
  )
}
