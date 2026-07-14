import { ForgeLayout } from "@/components/forge/ForgeLayout"
import { ForgeHero } from "@/components/forge/ForgeHero"
import { ForgeCapstone } from "@/components/forge/ForgeCapstone"
import { Seo } from "@/components/ui/Seo"

const PAINS = [
  "Reconciling Meta-reported ROAS with Shopify revenue and Amazon ACoS.",
  "Knowing whether Amazon and Meta are cannibalising or compounding.",
  "Scaling a winner without resetting learning; pausing a drain before it burns budget.",
  "LTV signal between CRM and the ad platforms: owned by no one, broken by everyone.",
]

const STARTS = [
  {
    h: "Scale winners faster",
    p: "when a creative wins, scaling runs automatically; under-performers pause in 48 hours, not 2 weeks.",
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <path d="M7 17 L17 7" />
        <path d="M11 7 H17 V13" />
      </svg>
    ),
  },
  {
    h: "Reconcile cross-channel",
    p: "Meta + Google + Amazon settled against Shopify revenue, one trusted number.",
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <path d="M4 9 H17" />
        <path d="M14 6 L17 9 L14 12" />
        <path d="M20 15 H7" />
        <path d="M10 12 L7 15 L10 18" />
      </svg>
    ),
  },
  {
    h: "Close the LTV loop",
    p: "high-value cohorts fed back into Meta CAPI and Google Customer Match continuously, not when someone remembers.",
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <path d="M20 12 a8 8 0 1 1-2.3-5.6" />
        <path d="M20 4 V8 H16" />
      </svg>
    ),
  },
  {
    h: "Stabilise brittle automation",
    p: "the scripts and flows that fail silently, rebuilt into one governed system.",
    icon: (
      <svg className="fg-icon" viewBox="0 0 24 24">
        <path d="M12 3 L19 6 V11 C19 16 12 21 12 21 C12 21 5 16 5 11 V6 Z" />
        <path d="M9 12 l2 2 l4-4" />
      </svg>
    ),
  },
]

const XIcon = (
  <svg className="fg-icon" viewBox="0 0 24 24">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
)

/** /forge/brands — AI Operations for brands. */
export function ForgeBrands() {
  return (
    <ForgeLayout>
      <Seo
        title="AI Agents for Brands | Zyou Forge"
        description="How Zyou builds and runs AI agents for brands, bringing every ad channel into one view your team can act on."
        canonical="https://zyou.ai/forge/brands"
      />
      <ForgeHero
        eyebrow="Forge · Brands · AI Operations"
        title="See every channel as one number. Then act on it."
        sub="We identify what's manual, fragile, and slow, and build it into one system that makes your spend work harder. We ship in weeks, not quarters."
      />

      {/* B2 THE SHIFT */}
      <section className="fg-section tight">
        <div className="fg-wrap">
          <h2 className="fg-h2 wide">Serious brands are building an AI operations layer. Most are stuck figuring out how.</h2>
          <p className="fg-lead">The connectors are commodity now. The brands that pull ahead build a <i>system</i> that compounds, not another stack of tools that don't talk to each other.</p>
        </div>
      </section>

      {/* B3 DIAGNOSIS */}
      <section className="fg-section">
        <div className="fg-wrap">
          <p className="fg-eyebrow">The diagnosis</p>
          <h2 className="fg-h2 wide">Your spend now lives across more channels. Your visibility hasn't kept up.</h2>
          <div className="fg-pains">
            {PAINS.map((p) => (
              <div key={p} className="fg-pain">
                <span className="x">{XIcon}</span>
                <p>{p}</p>
              </div>
            ))}
          </div>
          <p className="fg-invite">Tell us where we're wrong. We'd rather hear your reality than assume it.</p>
        </div>
      </section>

      {/* B4 WHERE WE START */}
      <section className="fg-section">
        <div className="fg-wrap">
          <p className="fg-eyebrow">Where we start</p>
          <h2 className="fg-h2">Pick one real problem. We start there.</h2>
          <div className="fg-cc">
            <div className="fg-cc-in">
              <div className="fg-cc-head">
                <span className="dots"><i /><i /><i /></span>
                <span className="who"><img src="/logos/brands/claude.svg" alt="Claude" />Claude Code</span>
              </div>
              <div className="fg-cc-body">
                <div className="fg-cc-prompt"><p>Where should we start on our ad operations?</p></div>
                <div className="fg-cc-chips">
                  <span>▸ reading accounts <span className="m">meta · google · amazon · shopify</span></span>
                  <span>▸ mapping what's manual, fragile, slow</span>
                  <span>▸ proposing four starting points<span className="fg-cc-caret" /></span>
                </div>
                <div className="fg-starts">
                  {STARTS.map((s) => (
                    <div key={s.h} className="fg-scard">
                      <span className="ic">{s.icon}</span>
                      <h4>{s.h}</h4>
                      <p>{s.p}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B5 PROOF */}
      <section className="fg-section tight">
        <div className="fg-wrap">
          <p className="fg-proof"><b>Built on real accounts, under real pressure.</b></p>
        </div>
      </section>

      {/* B6 CAPSTONE */}
      <ForgeCapstone>Give us one real problem. We'll surprise you with the speed of execution.</ForgeCapstone>
    </ForgeLayout>
  )
}
